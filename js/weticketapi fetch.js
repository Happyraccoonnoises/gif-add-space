// calendar.js
// Holt die kommenden Events aus dem WeTicket-XML(RSS)-Feed und rendert sie
// als Karten MIT Flyer in den Container #event-list.
//
// Wichtig: diese Datei muss js/calendar.js heißen — genau die lädt index.html.
// Die alte "weticketapi fetch.js" (nur iCal, ohne Bilder) wird damit ersetzt.

const FEED_URL =
  "https://api.weticket.io/storefront/organizations/019fafb2-e0ee-79b9-853d-a15e612d0301/events.xml";

async function ladeEvents() {
  const box = document.getElementById("event-list");
  if (!box) return; // Container nicht da → nichts tun

  try {
    const res = await fetch(FEED_URL);
    if (!res.ok) throw new Error("HTTP " + res.status);

    // XML einlesen und zu einem durchsuchbaren Dokument parsen
    const text = await res.text();
    const xml = new DOMParser().parseFromString(text, "application/xml");
    if (xml.querySelector("parsererror")) throw new Error("XML nicht lesbar");

    const items = [...xml.querySelectorAll("item")];
    if (items.length === 0) {
      box.innerHTML = '<p class="cal-empty">Aktuell keine Events. Bald mehr.</p>';
      return;
    }

    box.innerHTML = items
      .map((item) => {
        const txt = (sel) => item.querySelector(sel)?.textContent?.trim() || "";

        const title = txt("title");
        const link = txt("link");
        const pub = txt("pubDate");

        // kurze Beschreibung bevorzugen (namespaced), sonst normale
        const shortDesc =
          item.getElementsByTagName("weticket:shortDescription")[0]?.textContent?.trim();
        const desc = shortDesc || txt("description");

        // Flyer aus <enclosure url="..."> — nicht-namespaced, daher robust
        const img = item.querySelector("enclosure")?.getAttribute("url") || "";

        // Datum hübsch auf Deutsch
        const d = pub ? new Date(pub) : null;
        const dateStr =
          d && !isNaN(d)
            ? d.toLocaleString("de-DE", {
              weekday: "short",
              day: "2-digit",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }) + " Uhr"
            : "";

        return `
          <a class="cal-card" href="${link}" target="_blank" rel="noopener noreferrer">
            ${img ? `<div class="cal-card-img" style="background-image:url('${img}')"></div>` : ""}
            <div class="cal-card-body">
              ${dateStr ? `<span class="cal-card-date">${dateStr}</span>` : ""}
              <h3 class="cal-card-title">${title}</h3>
              ${desc ? `<p class="cal-card-desc">${desc}</p>` : ""}
              <span class="cal-card-cta">Tickets →</span>
            </div>
          </a>`;
      })
      .join("");
  } catch (err) {
    console.error("Kalender-Fehler:", err);
    box.innerHTML =
      '<p class="cal-empty">Events konnten gerade nicht geladen werden.</p>';
  }
}

ladeEvents();
