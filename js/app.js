document.addEventListener("DOMContentLoaded", async () => {
  const sumupButton = document.getElementById("sumup-button");
  const uploadForm = document.getElementById("upload-form");
  const backendStatus = document.getElementById("backend-status");

  if (sumupButton) {
    sumupButton.addEventListener("click", () => {
      alert("Hier startet später der Zahlungsflow (z.B. SumUp Checkout).");
    });
  }

  if (uploadForm) {
    uploadForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Hier kommt später das GIF-Upload-Handling (über Backend).");
    });
  }

  try {
    const response = await fetch("http://localhost:3000/api/ping");
    const data = await response.json();
    console.log("Backend-Antwort:", data);

    if (backendStatus) {
      backendStatus.textContent = "Backend-Status: verbunden";
    }

    const postResponse = await fetch("http://localhost:3000/api/test", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        source: "frontend",
        message: "Hallo vom Frontend",
        time: new Date().toISOString()
      })
    });

    const postData = await postResponse.json();
    console.log("POST-Antwort:", postData);

  } catch (error) {
    console.error("Fehler beim Verbinden mit dem Backend:", error);

    if (backendStatus) {
      backendStatus.textContent = "Backend-Status: nicht erreichbar";
    }
  }
});
