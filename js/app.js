document.addEventListener("DOMContentLoaded", () => {
  const gifUploadForm = document.getElementById("gif-upload-form");
  const uploadStatus = document.getElementById("upload-status");
  const latestGifStatus = document.getElementById("latest-gif-status");
  const latestGifImage = document.getElementById("latest-gif-image");
  const downloadGifButton = document.getElementById("download-gif-button");

  const API_BASE_URL = "https://gif-space-backend.onrender.com";
  let currentGifUrl = null;
  let currentGifName = "latest-gif.gif";
  let currentGifPath = null;

  if (gifUploadForm) {
    gifUploadForm.addEventListener("submit", async (event) => {
      event.preventDefault();

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

        if (!response.ok || !data.success) {
          if (uploadStatus) {
            uploadStatus.textContent = `Upload-Status: ${data.message || "Fehler beim Upload"}`;
          }
          return;
        }

        if (uploadStatus) {
          uploadStatus.textContent = "Upload-Status: GIF erfolgreich hochgeladen";
        }

        gifUploadForm.reset();
        await loadLatestGif();
      } catch (error) {
        console.error("Fehler beim Upload:", error);

        if (uploadStatus) {
          uploadStatus.textContent = "Upload-Status: Backend nicht erreichbar";
        }
      }
    });
  }

  async function loadLatestGif() {
    try {
      const response = await fetch(`${API_BASE_URL}/uploads/latest`, {
        cache: "no-store"
      });

      if (!response.ok) {
        if (latestGifStatus) {
          latestGifStatus.textContent = "Anzeige-Status: noch kein GIF vorhanden";
        }

        if (latestGifImage) {
          latestGifImage.style.display = "none";
        }

        if (downloadGifButton) {
          downloadGifButton.style.display = "none";
        }

        currentGifUrl = null;
        currentGifPath = null;
        return;
      }

      const data = await response.json();

      if (!data.success || !data.latestGif) {
        if (latestGifStatus) {
          latestGifStatus.textContent = "Anzeige-Status: noch kein GIF vorhanden";
        }

        if (latestGifImage) {
          latestGifImage.style.display = "none";
        }

        if (downloadGifButton) {
          downloadGifButton.style.display = "none";
        }

        currentGifUrl = null;
        currentGifPath = null;
        return;
      }

      currentGifName = data.latestGif.name || "latest-gif.gif";
      currentGifUrl = `${API_BASE_URL}${data.latestGif.path}`;

      if (data.latestGif.path !== currentGifPath) {
        currentGifPath = data.latestGif.path;

        if (latestGifImage) {
          latestGifImage.src = `${currentGifUrl}?t=${Date.now()}`;
          latestGifImage.style.display = "block";
        }
      }

      if (latestGifStatus) {
        latestGifStatus.textContent = "Anzeige-Status: GIF aktuell geladen";
      }

      if (downloadGifButton) {
        downloadGifButton.style.display = "block";
      }
    } catch (error) {
      console.error("Fehler beim Laden des neuesten GIFs:", error);

      if (latestGifStatus) {
        latestGifStatus.textContent = "Anzeige-Status: Fehler beim Laden";
      }
    }
  }

  if (downloadGifButton) {
    downloadGifButton.addEventListener("click", async () => {
      if (!currentGifUrl) {
        return;
      }

      try {
        const response = await fetch(currentGifUrl, {
          cache: "no-store"
        });

        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = blobUrl;
        link.download = currentGifName;
        document.body.appendChild(link);
        link.click();
        link.remove();

        window.URL.revokeObjectURL(blobUrl);
      } catch (error) {
        console.error("Fehler beim Download:", error);
      }
    });
  }

  loadLatestGif();
  setInterval(loadLatestGif, 30000);
});
