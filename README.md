# Big Bang Theory v2

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-Active-success.svg)
![Version](https://img.shields.io/badge/version-2.0-brightgreen.svg)

It is a modern open-source fan website for The Big Bang Theory built with vanilla HTML, CSS, and JS.

## 🌟 Project Significance

In an era of bloated web applications, **Big Bang Theory v2** stands as a testament to the power of a streamlined, vanilla technology stack. By avoiding heavy dependencies, we've achieved a blazing-fast user experience that feels native and premium. This project is designed not only as a comprehensive wiki for fans but also as a modern reference architecture for developers looking to build rich, state-driven interfaces without complex frameworks.

## 🛠 The Vanilla Stack

This application is engineered from the ground up using a pure, modern Vanilla Stack:
- **HTML5**: Semantic, highly-structured markup ensuring optimal SEO and screen-reader compatibility.
- **Vanilla CSS3**: Advanced modern CSS (variables, grid, flexbox, clamp, fluid typography) tailored to provide a cinematic and responsive visual aesthetic—no CSS frameworks required.
- **Vanilla JavaScript (ES6+)**: Custom SPA routing, state management, and DOM manipulation, delivering a lightning-fast experience free from third-party framework overhead.

## ✨ Highlight: Dark Mode & Accessibility (Engineered by AI Swarms)

A core focus of Version 2 is an unparalleled commitment to accessibility and user preference. Through advanced engineering—powered by AI swarms—we've integrated robust features tailored to all users:

- **Seamless Dark Mode:** A deeply integrated, locally-persisted dark mode scheme (`prefers-color-scheme` compatible) offering a low-strain cinematic viewing experience. The dark mode utilizes expertly crafted contrast ratios to ensure readability while preserving the premium aesthetic.
- **Colorblind-Friendly Palettes:** Carefully chosen semantic colors and UI feedback indicators that maintain distinguishability for varying types of color vision deficiency.
- **Blind & Screen-Reader Optimization:** Fully ARIA-compliant DOM structures, focus trapping in modals, and polite `aria-live` regions for dynamic content loading, ensuring visually impaired users have a flawless navigational experience.
- **Keyboard Navigation:** Full keyboard operability (Tab, Enter, Space, Escape) across all interactive elements, modals, and custom routers.

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
