const userLabel = document.querySelector("#userLabel");
const logoutButton = document.querySelector("#logoutButton");

async function loadCurrentUser() {
  const response = await fetch("/api/me");
  if (!response.ok) {
    window.location.href = "/";
    return;
  }

  const data = await response.json();
  userLabel.textContent = `${data.user.name} (${data.user.email})`;
}

logoutButton.addEventListener("click", async () => {
  await fetch("/api/logout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{}"
  });
  window.location.href = "/";
});

loadCurrentUser().catch(() => {
  window.location.href = "/";
});
