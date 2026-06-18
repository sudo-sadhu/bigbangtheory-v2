# Big Bang Theory v2

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-Active-success.svg)
![Version](https://img.shields.io/badge/version-2.0-brightgreen.svg)

It is a modern open-source fan website for The Big Bang Theory built with vanilla HTML, CSS, and JS.

## 🌟 Project Significance

In an era of bloated web applications, **Big Bang Theory v2** stands as a testament to the power of a streamlined, vanilla technology stack. By avoiding heavy dependencies, we've achieved a blazing-fast user experience that feels native and premium. This project is designed not only as a comprehensive wiki for fans but also as a modern reference architecture for developers looking to build rich, state-driven interfaces without complex frameworks.

## 🛠️ The Vanilla Stack

This application is engineered from the ground up using a pure, modern Vanilla Stack:
- **HTML5**: Semantic, highly-structured markup ensuring optimal SEO and performance.
- **Vanilla CSS3**: Modern custom CSS variables, grids, and flexboxes tailored to provide a cinematic, responsive visual layout.
- **Vanilla JavaScript (ES6+)**: Custom SPA routing, state management, and DOM manipulation for a fast experience without third-party frameworks.

## 🌟 Highlight Features

### 🎬 Sortable Episode Database (IMDb Ratings)
* Browse and search all 279 episodes of *The Big Bang Theory* across its 12 seasons.
* Sort and rank episodes by their official IMDb ratings (highest to lowest, lowest to highest) overall or on a per-season basis to get a quick overview of the most popular episodes.

### 🎭 Main Cast Profiles & Trait Cards
* Meet the main cast (Sheldon, Leonard, Penny, Raj, Howard, Bernadette, and Amy).
* Read detailed character bios, catchphrases, fun facts, and personality traits.

### 🎥 Iconic Moments
* Revisit the most famous and memorable scenes from the series with quick summaries.

### 🧠 Production Crew & Trivia
* Explore behind-the-scenes production data, including the creative team (creators, directors, writers).
* Discover fascinating fun facts about the series' development and writing.

---

## 👁️ Inclusive Experience & Modern Design
The website features a custom, system-compatible Dark Mode alongside accessibility features (ARIA compliance, keyboard navigation, and colorblind-safe contrasts) so that all fans can easily browse the database.

## 🚀 Getting Started

No `npm install` or complex build steps required.

1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/bigbangtheory-v2.git
   ```
2. Open `index.html` in your favorite modern browser, or serve it locally using any basic HTTP server:
   ```bash
   npx serve .
   # or
   python3 -m http.server
   ```
3. Enjoy the fastest Big Bang Theory database in the multiverse!

## 📂 Architecture Overview

```text
├── css/
│   └── styles.css       # Core design system and theming variables
├── js/
│   ├── app.js           # Core SPA router and UI logic
│   ├── data.js          # Local database containing TBBT content
│   └── flags.js         # Feature flags and configuration
├── images/              # Media assets and placeholders
└── index.html           # Main entry point and semantic structure
```

## 🤝 Contributing

We welcome contributions from the open-source community! Whether it's adding new trivia, optimizing CSS, or enhancing our accessibility features, your PRs are appreciated. Please ensure your contributions align with our vanilla stack philosophy and pass standard accessibility audits.

## 📄 License

This project is open-source and available under the MIT License.
