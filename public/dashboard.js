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

// --- AI Prediction Logic ---
const predictionForm = document.querySelector("#predictionForm");
const predictionResult = document.querySelector("#predictionResult");
const predictedPrice = document.querySelector("#predictedPrice");

if (predictionForm) {
  predictionForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const formData = new FormData(predictionForm);
    const submitBtn = predictionForm.querySelector("button[type='submit']");
    
    // Construct payload matching the server.js required fields
    const payload = {
      Open: parseFloat(formData.get("Open")),
      High: parseFloat(formData.get("High")),
      Low: parseFloat(formData.get("Low")),
      Close: parseFloat(formData.get("Close")),
      Volume: parseInt(formData.get("Volume"), 10)
    };

    submitBtn.textContent = "Running Neural Net...";
    submitBtn.disabled = true;
    predictionResult.classList.add("hidden");

    try {
      const response = await fetch("/api/ml/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.hint || "Prediction failed.");
      }

      // Display the result (assumes your FastAPI returns { "prediction": 1234.56 } or similar)
      const finalValue = data.prediction || data.predicted_close || 0;
      
      predictionResult.classList.remove("hidden");
      predictedPrice.textContent = `₹${parseFloat(finalValue).toFixed(2)}`;
      
    } catch (error) {
      alert(`Prediction Error: ${error.message}`);
    } finally {
      submitBtn.textContent = "Run Prediction";
      submitBtn.disabled = false;
    }
  });
}