# 🃏 Classic Blackjack Web Game

[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

An interactive, responsive browser-based **Blackjack (21)** card game built with vanilla HTML5, CSS3, and modern JavaScript. Features classic casino green-felt table visuals, intuitive controls, real-time score summation, and win/bust state evaluation.

---

## 🎮 Game Demo & Gameplay

- **Goal**: Reach a card total as close to **21** as possible without exceeding it.
- **Hit 21**: You hit **Blackjack** and win!
- **Over 21**: You **bust** and are out of the round.

### 📜 Game Rules
1. Each round starts by drawing **two random cards**.
2. **Card Values**:
   - Number cards (`2` through `10`): Face value.
   - Face cards (`J`, `Q`, `K`): Count as `10`.
   - Ace (`A`): Counts as `11`.
3. Press **"NEW CARD"** to draw another card if you have not busted or hit Blackjack.
4. Press **"START GAME"** anytime to reset and start a fresh hand.

---

## 🛠️ Built With

- **HTML5**: Semantic game markup and accessible rule headings.
- **CSS3**: Custom casino table green-felt texture backdrop, button animations, and mobile-friendly typography.
- **JavaScript (ES6+)**: Pure functional game state engine managing card draws, score summation, and reactive DOM updates.

---

## 🚀 How to Run Locally

No dependencies or build tools required!

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Sanyam961/Blackjack-game.git
   cd Blackjack-game
   ```

2. **Open the game**:
   - Simply double-click `index.html` in any browser, or
   - Serve using VS Code Live Server / `npx serve .`

---

## 📂 Project Structure

```
Blackjack-game/
├── index.html       # Primary game structure and layout
├── file.css         # Casino green-felt styling and button effects
├── game.js          # Core Blackjack logic and state management
├── table.png        # Authentic casino table texture
└── README.md        # Documentation
```

---

## 👤 Author

**Sanyam Sharma**
- GitHub: [@Sanyam961](https://github.com/Sanyam961)

---

## 📄 License

This project is licensed under the MIT License.
