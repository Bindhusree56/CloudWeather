# ⛅ CloudWeather

A modern, atmospheric weather application built with **HTML**, **CSS**, and **JavaScript**. Search any city worldwide and get live weather data alongside stunning city photography.

---

## 🔗 Live Demo

[![Live Demo](https://img.shields.io/badge/Live-Demo-c9a84c?style=for-the-badge&logo=github)](https://bindhusree56.github.io/CloudWeather/)

---

## ✨ Features

| Feature | Details |
|---|---|
| 🌍 City Search | Live weather for any city worldwide |
| 📍 Geolocation | One-click weather for your current location |
| 🌡️ Live Data | Temperature, humidity, wind speed, feels-like, visibility |
| 📅 5-Day Forecast | High/low temps with visual percentage bars |
| 🖼️ Dynamic Imagery | Auto-cycling Unsplash city photography in the hero |
| 🌓 Dark / Light Mode | Persistent theme switching |
| ✨ Parallax Scrolling | Depth-layered hero and forecast backgrounds |
| 🖱️ Custom Cursor | Gold-accented magnetic cursor on desktop |
| 📊 Live Stats Bar | Pinned weather summary that appears after a search |
| 💫 Micro-interactions | Hover lifts, animated temperature counter, icon glow, card stagger |
| 📱 Fully Responsive | Mobile hamburger menu, adaptive grid layouts |

---

## 🎨 Design System

**Aesthetic:** Luxury Atmospheric Dark — deep navy + warm gold, inspired by city-at-night photography.

- **Display Font:** Playfair Display (serif, italic accents)
- **Body Font:** DM Sans (clean, modern)
- **Accent Color:** `#c9a84c` warm gold
- **Background:** Deep navy `#0a0e1a`
- **Effects:** Grain overlay, glassmorphism cards, scroll progress bar, parallax layers

---

## 🛠️ Tech Stack

- **HTML5** — Semantic, accessible markup
- **CSS3** — Custom properties, `@keyframes`, `IntersectionObserver` reveals, CSS Grid
- **Vanilla JavaScript** — No frameworks, no dependencies
- **[OpenWeatherMap API](https://openweathermap.org/api)** — Current weather + 5-day forecast
- **[Unsplash API](https://unsplash.com/developers)** — City photography

---

## 🚀 Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/bindhusree56/CloudWeather.git
cd CloudWeather

# 2. Add your API keys in app.js
const accessKey = 'YOUR_UNSPLASH_ACCESS_KEY';
const apiKey    = 'YOUR_OPENWEATHERMAP_KEY';

# 3. Open in browser
open index.html
```

---

## 📁 Project Structure

```
CloudWeather/
├── index.html      # App structure and markup
├── style.css       # All styles, animations, theme variables
├── app.js          # Weather fetching, UI updates, interactions
├── london.webp     # Default hero background image
└── README.md
```

---

## 📸 Screenshots

> _Search a city to see live weather data and a matching city photo in the hero._

---

## 🔑 API Keys

Get your free keys at:
- **OpenWeatherMap:** https://openweathermap.org/api
- **Unsplash:** https://unsplash.com/developers

---

## 📄 License

MIT © 2026 CloudWeather