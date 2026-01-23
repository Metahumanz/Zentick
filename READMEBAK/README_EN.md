# ⏳ Zentick

> A refined, smooth, and modern web clock & countdown timer.
>
> **Live Demo 👉 [zentick.dpdns.org](http://zentick.dpdns.org)**
>
> [中文文档](./README.md) 🇨🇳 | [Deutsche Dokumentation](./README_DE.md) 🇩🇪

---

### 👋 Backstory

This is my second take on building a web clock. To be honest, my first attempt was pretty rough and basic.

For Zentick, I decided to rebuild it from the ground up using a modern tech stack (Node.js). The goal wasn't just to tell time, but to create a visually satisfying experience.

### ✨ Features

*   **3 Distinct Styles**:
    *   📱 **Modern Digital**: Clean, rounded typography inspired by Apple design.
    *   ⌚ **Analog**: Classic clock face with hands.
    *   💡 **Nixie Tube**: Simulates the glowing neon texture of vintage tubes (although rough).
*   **Interactions**: Particle backgrounds that react to your mouse; Double-click or press 'F' for immersive fullscreen mode.
*   **Smart Countdown**: Custom duration support; progress is preserved even when switching between clock and countdown views.
*   **Auto-Save**: Remembers your preferences (selected face, timer settings, theme) locally.
*   **Responsive**: Adapts to Dark/Light modes and works great on both desktop and mobile.

### 🛠️ Run Locally

Follow these steps to run the project on your machine.

**Prerequisites:** [Node.js](https://nodejs.org/)

1.  **Install dependencies**:
    Open your terminal and run:
    ```bash
    npm install
    ```

2.  **Setup Environment** (Optional):
    *   Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key if you plan to use AI features.
    *   *Note: If you are only using the Clock/Countdown features, you can skip this step.*

3.  **Run the app**:
    ```bash
    npm run dev
    ```

### 🤝 Feedback & Contribution

If you have any suggestions, feature requests, or found a bug, feel free to open an **Issue** or submit a **Pull Request**.

Your feedback is highly appreciated and helps make Zentick better!

---

**Made with Gemini 3.0 pro preview**