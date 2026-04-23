// app.js – Platzhalter / später: Logik für SumUp + GIF-Upload

// Beispiel: Funktion, die später beim Klick auf SumUp-Aktion ausgelöst wird

document.addEventListener("DOMContentLoaded", () => {
  const sumupButton = document.getElementById("sumup-button");
  const uploadForm = document.getElementById("upload-form");

  if (sumupButton) {
    sumupButton.addEventListener("click", () => {
      alert("Hier startet später der Zahlungsflow (z.B. SumUp Checkout).");
      // später: SumUp JavaScript Widget / API‑Aufruf einbauen
    });
  }

  if (uploadForm) {
    uploadForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Hier kommt später das GIF-Upload-Handling (über Backend).");
    });
  }
});
