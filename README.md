# 🃏 Royal Vegas Blackjack — Classic Casino 21

[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

A premier, authentic **Las Vegas Casino Blackjack (21)** web game built with vanilla HTML5, CSS3, and modern JavaScript. Features full casino rules (Player vs. Dealer), 3D interactive betting chips, real-time Web Audio API sound synthesis, and smooth card dealing animations.

---

## ✨ Features & Enhancements

- **♠️ True Casino Rules (Player vs. Dealer)**:
  - 52-card standard deck shuffled with the Fisher-Yates algorithm.
  - Dealer receives 1 upcard and 1 hidden hole card, drawing to 16 and standing on all 17s.
  - **Natural Blackjack** pays 3 to 2!
  - Dynamic **Ace Valuation** (automatically calculates as 11 or 1 to prevent busts).
- **⚡ Core Casino Player Actions**:
  - **HIT**: Draw an extra card.
  - **STAND**: Lock your total and trigger the Dealer's turn.
  - **DOUBLE DOWN**: Double your wager for exactly one additional card.
- **💰 Interactive 3D Chip Betting & Bankroll Engine**:
  - Casino chips ($10, $25, $50, $100, $500) with realistic hover elevation and click sounds.
  - Persistent bankroll saved in browser `localStorage`.
  - Automatic $500 complimentary reload if you run out of chips!
  - **"SAME BET & DEAL"** quick replay button for rapid rounds.
- **🔊 Zero-Asset Web Audio Synthesizer**:
  - Procedural sound effects synthesized via the browser's native Web Audio API (chip clinking, card dealing swishes, win fanfares, bust drops).
  - Quick mute/unmute toggle in the header.
- **🔥 Win Streak & Stats Tracking**: Live win streak counter and current bet indicators.
- **📱 Fully Responsive Mobile & Desktop Layout**: Glassmorphic dark velvet felt table aesthetic styled for both mobile phones and wide desktop monitors.

---

## 🎮 How to Play

1. **Place Your Bet**: Click on any casino chip ($10, $25, $50, $100, $500) or press **ALL IN**.
2. **Deal the Hand**: Click **DEAL HAND**.
3. **Make Your Move**:
   - Press **HIT** to draw another card.
   - Press **STAND** if you are satisfied with your score.
   - Press **DOUBLE** to double your bet and take one final card.
4. **Win Conditions**:
   - Beat the dealer's score without exceeding 21.
   - If the dealer exceeds 21, the dealer busts and you win!
   - Equal scores result in a **PUSH** (your bet is returned).

---

## 🚀 Running Locally

Zero build steps or third-party dependencies required!

```bash
# Clone the repository
git clone https://github.com/Sanyam961/Blackjack-game.git
cd Blackjack-game

# Simply open index.html in your browser or run a lightweight local server:
python -m http.server 8080
```
Open [http://localhost:8080](http://localhost:8080) to play.

---

## 📁 Repository Structure

```
Blackjack-game/
├── index.html       # Casino table layout, chip dock, and scoreboards
├── file.css         # Casino green-felt styling, 3D chips, and card animations
├── game.js          # Blackjack deck engine, dealer AI, audio synth, and state
├── table.png        # Casino background texture
└── README.md        # Game guide and documentation
```

---

## 👤 Author

**Sanyam Sharma**
- GitHub: [@Sanyam961](https://github.com/Sanyam961)

---

## 📄 License

This project is licensed under the MIT License.
