const http = require("http");
const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");

const PORT = Number(process.env.PORT || 3000);
const PUBLIC_DIR = path.join(__dirname, "public");
const DATA_DIR = path.join(__dirname, "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const sessions = new Map();

// ── Load .env manually (no extra deps) ───────────────────────────────────────
try {
  const envText = require("fs").readFileSync(path.join(__dirname, ".env"), "utf8");
  envText.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const eq = trimmed.indexOf("=");
    if (eq === -1) return;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim();
    if (key && !(key in process.env)) process.env[key] = val;
  });
} catch {}

const BACKEND_API_URL = process.env.BACKEND_API_URL || "http://localhost:8000";

// ── MIME types ────────────────────────────────────────────────────────────────
const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
};

// ── Data helpers ──────────────────────────────────────────────────────────────
async function ensureStore() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(USERS_FILE);
  } catch {
    await fs.writeFile(USERS_FILE, "[]\n", "utf8");
  }
}

async function readUsers() {
  await ensureStore();
  return JSON.parse(await fs.readFile(USERS_FILE, "utf8"));
}

async function writeUsers(users) {
  await ensureStore();
  await fs.writeFile(USERS_FILE, `${JSON.stringify(users, null, 2)}\n`, "utf8");
}

// ── Auth helpers ──────────────────────────────────────────────────────────────
function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.pbkdf2Sync(password, salt, 120000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const candidate = hashPassword(password, salt).split(":")[1];
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(candidate, "hex"));
}

function sendJson(res, status, body, headers = {}) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8", ...headers });
  res.end(JSON.stringify(body));
}

function parseCookies(req) {
  return Object.fromEntries(
    (req.headers.cookie || "")
      .split(";")
      .map((part) => part.trim().split("="))
      .filter(([key]) => key)
      .map(([key, value]) => [key, decodeURIComponent(value || "")])
  );
}

function createSession(userId) {
  const token = crypto.randomBytes(32).toString("hex");
  sessions.set(token, { userId, createdAt: Date.now() });
  return token;
}

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt };
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function getRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        req.destroy();
        reject(new Error("Request body is too large."));
      }
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error("Invalid JSON body."));
      }
    });
    req.on("error", reject);
  });
}

// ── ML proxy ──────────────────────────────────────────────────────────────────
// Forwards POST /api/ml/predict → FastAPI backend /predict
// FastAPI runs separately (python -m uvicorn app.main:app --port 8000)
function proxyToBackend(backendPath, reqBody) {
  return new Promise((resolve, reject) => {
    const url = new URL(BACKEND_API_URL);
    const isHttps = url.protocol === "https:";
    const transport = isHttps ? require("https") : require("http");
    const payload = JSON.stringify(reqBody);

    const options = {
      hostname: url.hostname,
      port: url.port || (isHttps ? 443 : 80),
      path: backendPath,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(payload),
      },
    };

    const proxyReq = transport.request(options, (proxyRes) => {
      let data = "";
      proxyRes.on("data", (chunk) => (data += chunk));
      proxyRes.on("end", () => {
        try {
          resolve({ status: proxyRes.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: 502, body: { message: "Invalid response from ML backend." } });
        }
      });
    });

    proxyReq.on("error", (err) => {
      reject(new Error(`ML backend unreachable (${BACKEND_API_URL}): ${err.message}`));
    });

    proxyReq.setTimeout(15000, () => {
      proxyReq.destroy();
      reject(new Error("ML backend request timed out."));
    });

    proxyReq.write(payload);
    proxyReq.end();
  });
}

// ── API router ────────────────────────────────────────────────────────────────
async function handleApi(req, res) {
  try {
    // ── ML prediction proxy ───────────────────────────────────────────────────
    if (req.method === "POST" && req.url === "/api/ml/predict") {
      const body = await getRequestBody(req);

      // Basic field validation before forwarding
      const required = ["Open", "High", "Low", "Close", "Volume"];
      const missing = required.filter((k) => body[k] == null);
      if (missing.length) {
        return sendJson(res, 400, { message: `Missing fields: ${missing.join(", ")}` });
      }

      try {
        const { status, body: mlBody } = await proxyToBackend("/predict", body);
        return sendJson(res, status, mlBody);
      } catch (err) {
        return sendJson(res, 503, {
          message: err.message,
          hint: `Make sure the FastAPI backend is running at ${BACKEND_API_URL}`,
        });
      }
    }

    // ── ML health check ───────────────────────────────────────────────────────
    if (req.method === "GET" && req.url === "/api/ml/health") {
      try {
        const { status, body: mlBody } = await new Promise((resolve, reject) => {
          const url = new URL(BACKEND_API_URL);
          const transport = url.protocol === "https:" ? require("https") : require("http");
          const options = { hostname: url.hostname, port: url.port || 80, path: "/health", method: "GET" };
          const r = transport.request(options, (resp) => {
            let d = "";
            resp.on("data", (c) => (d += c));
            resp.on("end", () => resolve({ status: resp.statusCode, body: JSON.parse(d) }));
          });
          r.on("error", reject);
          r.setTimeout(5000, () => { r.destroy(); reject(new Error("timeout")); });
          r.end();
        });
        return sendJson(res, status, mlBody);
      } catch {
        return sendJson(res, 503, { status: "offline", message: `Cannot reach ${BACKEND_API_URL}` });
      }
    }

    // ── Register ──────────────────────────────────────────────────────────────
    if (req.method === "POST" && req.url === "/api/register") {
      const body = await getRequestBody(req);
      const name = String(body.name || "").trim();
      const email = String(body.email || "").trim().toLowerCase();
      const password = String(body.password || "");
      const confirmPassword = String(body.confirmPassword || "");

      if (name.length < 2) return sendJson(res, 400, { message: "Enter your full name." });
      if (!validateEmail(email)) return sendJson(res, 400, { message: "Enter a valid email address." });
      if (password.length < 8) return sendJson(res, 400, { message: "Password must be at least 8 characters." });
      if (password !== confirmPassword) return sendJson(res, 400, { message: "Passwords do not match." });

      const users = await readUsers();
      if (users.some((user) => user.email === email)) {
        return sendJson(res, 409, { message: "An account with this email already exists." });
      }

      const user = {
        id: crypto.randomUUID(),
        name,
        email,
        passwordHash: hashPassword(password),
        createdAt: new Date().toISOString(),
      };
      users.push(user);
      await writeUsers(users);

      const token = createSession(user.id);
      return sendJson(res, 201, { user: publicUser(user) }, {
        "Set-Cookie": `stockflow_session=${encodeURIComponent(token)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=604800`,
      });
    }

    // ── Login ─────────────────────────────────────────────────────────────────
    if (req.method === "POST" && req.url === "/api/login") {
      const body = await getRequestBody(req);
      const email = String(body.email || "").trim().toLowerCase();
      const password = String(body.password || "");
      const users = await readUsers();
      const user = users.find((item) => item.email === email);

      if (!user || !verifyPassword(password, user.passwordHash)) {
        return sendJson(res, 401, { message: "Invalid email or password." });
      }

      const token = createSession(user.id);
      return sendJson(res, 200, { user: publicUser(user) }, {
        "Set-Cookie": `stockflow_session=${encodeURIComponent(token)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=604800`,
      });
    }

    // ── Logout ────────────────────────────────────────────────────────────────
    if (req.method === "POST" && req.url === "/api/logout") {
      const token = parseCookies(req).stockflow_session;
      if (token) sessions.delete(token);
      return sendJson(res, 200, { message: "Logged out." }, {
        "Set-Cookie": "stockflow_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0",
      });
    }

    // ── Me ────────────────────────────────────────────────────────────────────
    if (req.method === "GET" && req.url === "/api/me") {
      const token = parseCookies(req).stockflow_session;
      const session = token ? sessions.get(token) : null;
      if (!session) return sendJson(res, 401, { message: "Not authenticated." });

      const users = await readUsers();
      const user = users.find((item) => item.id === session.userId);
      if (!user) return sendJson(res, 401, { message: "Not authenticated." });
      return sendJson(res, 200, { user: publicUser(user) });
    }

    return sendJson(res, 404, { message: "API route not found." });
  } catch (error) {
    return sendJson(res, 500, { message: error.message || "Server error." });
  }
}

// ── Static file server ────────────────────────────────────────────────────────
async function serveStatic(req, res) {
  const urlPath = decodeURIComponent(req.url.split("?")[0]);
  const requested = urlPath === "/" ? "/index.html" : urlPath;
  const filePath = path.normalize(path.join(PUBLIC_DIR, requested));

  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  try {
    const content = await fs.readFile(filePath);
    res.writeHead(200, {
      "Content-Type": mimeTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream",
    });
    res.end(content);
  } catch {
    const index = await fs.readFile(path.join(PUBLIC_DIR, "index.html"));
    res.writeHead(200, { "Content-Type": mimeTypes[".html"] });
    res.end(index);
  }
}

// ── Main server ───────────────────────────────────────────────────────────────
const server = http.createServer((req, res) => {
  if (req.url.startsWith("/api/")) {
    handleApi(req, res);
    return;
  }
  serveStatic(req, res);
});

ensureStore().then(() => {
  server.listen(PORT, () => {
    console.log(`StockFlow UI  → http://localhost:${PORT}`);
    console.log(`ML backend    → ${BACKEND_API_URL}`);
    console.log(`Predict API   → POST /api/ml/predict  (proxied)`);
  });
});
