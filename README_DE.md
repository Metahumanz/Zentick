# ⏳ Zentick

> Ein elegantes, flüssiges und modernes Web-Uhr- & Countdown-Tool.
>
> **Online-Demo 👉 [zentick.dpdns.org](http://zentick.dpdns.org)**
>
> [Read this in English](./README_EN.md) 🌍 | [中文文档](./README.md) 🇨🇳

---

### 👋 Über dieses Projekt

Dies ist mein zweites Web-Uhr-Projekt. Um ehrlich zu sein, war die erste Version ziemlich einfach und hatte nur einen begrenzten Funktionsumfang.

Deshalb habe ich beschlossen, alles von Grund auf neu zu bauen und einen modernen Tech-Stack (Node.js) zu verwenden. Bei Zentick geht es nicht nur darum, die Zeit abzulesen, sondern auch um das visuelle Erlebnis und das reibungslose Bediengefühl.

### ✨ Hauptfunktionen

*   **Drei Zifferblatt-Stile**:
    *   📱 **Modern Digital**: Abgerundete Schriftart im Apple-Stil, klar und gut lesbar.
    *   ⌚ **Analog**: Klassisches Zifferblatt mit Zeigern, elegant und retro.
    *   💡 **Nixie-Röhre**: Simuliert die Leuchttextur von glühenden Metalldrähten (auch wenn es nicht zu 100% wie das Original aussieht).
*   **Interaktion**: Hintergrundpartikel folgen der Mausbewegung; Vollbildmodus per Doppelklick oder F-Taste; automatisches Ausblenden unnötiger UI-Elemente im Vollbild.
*   **Countdown**: Unterstützt benutzerdefinierte Dauer (Stunden/Minuten/Sekunden); der Fortschritt bleibt auch beim Wechseln zwischen den Ansichten erhalten.
*   **Lokaler Speicher**: Speichert automatisch deine Einstellungen (Zifferblatt, Countdown-Zeit, Sprache usw.), sodass sie beim Neuladen der Seite erhalten bleiben.
*   **Anpassung**: Unterstützt Hell- und Dunkelmodus (Dark/Light Mode) und ist für Desktop- sowie Mobilgeräte optimiert.

### 🛠️ Lokale Ausführung

Wenn du das Projekt lokal ausführen oder weiterentwickeln möchtest, befolge bitte diese Schritte.

**Voraussetzung**: Du musst [Node.js](https://nodejs.org/) installiert haben.

1.  **Abhängigkeiten installieren**:
    Öffne das Terminal und führe folgenden Befehl aus:
    ```bash
    npm install
    ```

2.  **Umgebung konfigurieren** (Optional):
    *   Wenn das Projekt die Google Gemini API (für KI-Funktionen) benötigt, setze deinen API-Key in der Datei `.env.local` unter `GEMINI_API_KEY`.
    *   *Hinweis: Wenn du nur die statischen Uhr- und Countdown-Funktionen nutzt, kannst du diesen Schritt überspringen.*

3.  **Projekt starten**:
    ```bash
    npm run dev
    ```
    Nach dem Start öffnet der Browser normalerweise automatisch die lokale Vorschau.

### 🤝 Feedback & Mitwirkung

Wenn du Vorschläge hast, Fehler findest oder neue Funktionen anfragen möchtest, kannst du gerne ein **Issue** öffnen oder einen **Pull Request** einreichen.

Dein Feedback hilft sehr dabei, Zentick noch besser zu machen!

---

**Erstellt mit Gemini 3.0 pro preview**