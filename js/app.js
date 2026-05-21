document.addEventListener("DOMContentLoaded", async () => {
  // =========================
  // Elemente aus dem DOM holen
  // =========================
  const sumupButton = document.getElementById("sumup-button");
  const uploadContainer = document.getElementById("upload-form");
  const gifUploadForm = document.getElementById("gif-upload-form");
  const backendStatus = document.getElementById("backend-status");
  const checkoutStatus = document.getElementById("checkout-status");
  const uploadStatus = document.getElementById("upload-status");
  const latestGifStatus = document.getElementById("latest-gif-status");
  const latestGifImage = document.getElementById("latest-gif-image");
  const API_BASE_URL = "https://gif-space-backend.onrender.com";

  // =========================
  // SumUp Checkout vorbereiten
  // =========================
  if (sumupButton) {
    sumupButton.addEventListener("click", async () => {
      try {
        if (checkoutStatus) {
          checkoutStatus.textContent = "Checkout-Status: wird erstellt...";
        }

        const checkoutResponse = await fetch(`${API_BASE_URL}/payments/create-checkout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            amount: 5,
            description: "Test-Spende für GIF Add Space"
          })
        });

        const checkoutData = await checkoutResponse.json();
        console.log("Checkout-Antwort:", checkoutData);

        if (!checkoutData.success) {
          if (checkoutStatus) {
            checkoutStatus.textContent = `Checkout-Status: ${checkoutData.message}`;
          }
          return;
        }

        if (checkoutStatus) {
          if (checkoutData.checkoutDraft) {
            checkoutStatus.textContent = `Checkout-Status: vorbereitet (${checkoutData.checkoutDraft.checkout_reference})`;
          } else if (checkoutData.checkout) {
            checkoutStatus.textContent = `Checkout-Status: ${checkoutData.checkout.status} (${checkoutData.checkout.id})`;
          } else {
            checkoutStatus.textContent = "Checkout-Status: erfolgreich vorbereitet";
          }
        }
      } catch (error) {
        console.error("Fehler beim Checkout-Test:", error);

        if (checkoutStatus) {
          checkoutStatus.textContent = "Checkout-Status: Fehler beim Erstellen";
        }
      }
    });
  }

  // =========================
  // GIF-Upload ans Backend senden
  // =========================
  if (gifUploadForm) {
    gifUploadForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(gifUploadForm);

      try {
        if (uploadStatus) {
          uploadStatus.textContent = "Upload-Status: Datei wird hochgeladen...";
        }

        const response = await fetch(`${API_BASE_URL}/uploads/gif`, {
          method: "POST",
          body: formData
        });

        const data = await response.json();
        console.log("Upload-Antwort:", data);

        if (!response.ok || !data.success) {
          if (uploadStatus) {
            uploadStatus.textContent = `Upload-Status: ${data.message || "Fehler beim Upload"}`;
          }
          return;
        }

        if (uploadStatus) {
          uploadStatus.textContent = `Upload-Status: erfolgreich (${data.file.storedName})`;
        }

        await loadLatestGif();
      } catch (error) {
        console.error("Fehler beim Upload:", error);

        if (uploadStatus) {
          uploadStatus.textContent = "Upload-Status: Backend nicht erreichbar";
        }
      }
    });
  }

  // =========================
  // Neuestes GIF laden
  // =========================
  async function loadLatestGif() {
    try {
      if (latestGifStatus) {
        latestGifStatus.textContent = "Anzeige-Status: lade neuestes GIF...";
      }

      const response = await fetch(`${API_BASE_URL}/uploads/latest`);
      const data = await response.json();

      if (!response.ok || !data.success || !data.latestGif) {
        if (latestGifStatus) {
          latestGifStatus.textContent = "Anzeige-Status: noch kein GIF vorhanden";
        }

        if (latestGifImage) {
          latestGifImage.style.display = "none";
        }

        return;
      }

      const imageUrl = `${API_BASE_URL}${data.latestGif.path}?t=${Date.now()}`;

      if (latestGifImage) {
        latestGifImage.src = imageUrl;
        latestGifImage.style.display = "block";
      }

      if (latestGifStatus) {
        latestGifStatus.textContent = `Anzeige-Status: geladen (${data.latestGif.name})`;
      }
    } catch (error) {
      console.error("Fehler beim Laden des neuesten GIFs:", error);

      if (latestGifStatus) {
        latestGifStatus.textContent = "Anzeige-Status: Fehler beim Laden";
      }

      if (latestGifImage) {
        latestGifImage.style.display = "none";
      }
    }
  }

  // =========================
  // Backend-Verbindung testen
  // =========================
  try {
    const response = await fetch(`${API_BASE_URL}/api/ping`);
    const data = await response.json();
    console.log("Backend-Antwort:", data);

    if (backendStatus) {
      backendStatus.textContent = "Backend-Status: verbunden";
    }

    const postResponse = await fetch(`${API_BASE_URL}/api/test`, {
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

    if (checkoutStatus) {
      checkoutStatus.textContent = "Checkout-Status: Backend nicht verbunden";
    }

    if (uploadStatus) {
      uploadStatus.textContent = "Upload-Status: Backend nicht verbunden";
    }

    if (latestGifStatus) {
      latestGifStatus.textContent = "Anzeige-Status: Backend nicht verbunden";
    }
  }

  // =========================
  // Beim Laden der Seite direkt
  // das neueste GIF anzeigen
  // =========================
  await loadLatestGif();
});
