const shell = document.querySelector("#appShell");
const loginForm = document.querySelector("#loginForm");
const registerForm = document.querySelector("#registerForm");
const loginMessage = document.querySelector("#loginMessage");
const registerMessage = document.querySelector("#registerMessage");

function setMessage(target, text, isSuccess = false) {
  target.textContent = text;
  target.classList.toggle("success", isSuccess);
}

function showForm(name) {
  const isRegister = name === "register";
  loginForm.classList.toggle("hidden", isRegister);
  registerForm.classList.toggle("hidden", !isRegister);
  shell.classList.toggle("register-theme", isRegister);
  setMessage(loginMessage, "");
  setMessage(registerMessage, "");
}

function formData(form) {
  return Object.fromEntries(new FormData(form).entries());
}

async function request(path, payload) {
  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Something went wrong.");
  return data;
}

function setLoading(form, isLoading) {
  const button = form.querySelector(".primary-button");
  button.disabled = isLoading;
  button.textContent = isLoading ? "Please wait..." : button.dataset.label;
}

document.querySelectorAll("[data-show]").forEach((button) => {
  button.addEventListener("click", () => showForm(button.dataset.show));
});

document.querySelectorAll("[data-message]").forEach((button) => {
  button.addEventListener("click", () => setMessage(loginMessage, button.dataset.message));
});

document.querySelectorAll(".primary-button").forEach((button) => {
  button.dataset.label = button.textContent;
});

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  setMessage(loginMessage, "");
  const payload = formData(loginForm);

  if (!payload.email || !payload.password) {
    setMessage(loginMessage, "Enter your email and password.");
    return;
  }

  try {
    setLoading(loginForm, true);
    await request("/api/login", payload);
    window.location.href = "/dashboard.html";
  } catch (error) {
    setMessage(loginMessage, error.message);
  } finally {
    setLoading(loginForm, false);
  }
});

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  setMessage(registerMessage, "");
  const payload = formData(registerForm);

  if (!registerForm.terms.checked) {
    setMessage(registerMessage, "Please accept the terms to continue.");
    return;
  }

  if (payload.password !== payload.confirmPassword) {
    setMessage(registerMessage, "Passwords do not match.");
    return;
  }

  try {
    setLoading(registerForm, true);
    await request("/api/register", payload);
    window.location.href = "/dashboard.html";
  } catch (error) {
    setMessage(registerMessage, error.message);
  } finally {
    setLoading(registerForm, false);
  }
});
