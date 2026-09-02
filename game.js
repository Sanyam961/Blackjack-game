/* ==========================================================================
   ROYAL VEGAS BLACKJACK - ADVANCED CASINO GAME ENGINE
   ========================================================================== */

// ── State Variables ────────────────────────────────────────────────────────
const SUITS = [
  { name: "spades", symbol: "♠", color: "black" },
  { name: "hearts", symbol: "♥", color: "red" },
  { name: "diamonds", symbol: "♦", color: "red" },
  { name: "clubs", symbol: "♣", color: "black" }
];

const RANKS = [
  { rank: "A", value: 11 },
  { rank: "2", value: 2 },
  { rank: "3", value: 3 },
  { rank: "4", value: 4 },
  { rank: "5", value: 5 },
  { rank: "6", value: 6 },
  { rank: "7", value: 7 },
  { rank: "8", value: 8 },
  { rank: "9", value: 9 },
  { rank: "10", value: 10 },
  { rank: "J", value: 10 },
  { rank: "Q", value: 10 },
  { rank: "K", value: 10 }
];

let deck = [];
let playerHand = [];
let dealerHand = [];
let bankroll = parseInt(localStorage.getItem("rv_bankroll") || "1000", 10);
let currentBet = 0;
let lastBet = 50;
let streak = 0;
let soundEnabled = true;
let isRoundActive = false;
let dealerHoleCardRevealed = false;

// ── DOM Elements ───────────────────────────────────────────────────────────
const bankrollEl = document.getElementById("bankroll-el");
const currentBetEl = document.getElementById("current-bet-el");
const streakEl = document.getElementById("streak-el");
const bannerMessage = document.getElementById("banner-message");
const soundToggleBtn = document.getElementById("sound-toggle-btn");

const dealerCardsEl = document.getElementById("dealer-cards-el");
const playerCardsEl = document.getElementById("player-cards-el");
const dealerScoreEl = document.getElementById("dealer-score-el");
const playerScoreEl = document.getElementById("player-score-el");

const bettingControls = document.getElementById("betting-controls");
const playingControls = document.getElementById("playing-controls");
const roundOverControls = document.getElementById("round-over-controls");
const dealBtn = document.getElementById("deal-btn");
const doubleBtn = document.getElementById("double-btn");

// ── Web Audio Synthesizer ──────────────────────────────────────────────────
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) audioCtx = new AudioContext();
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

function playSound(type) {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    if (type === "chip") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(1400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } else if (type === "deal") {
      const node = ctx.createBufferSource();
      const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.08, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < buffer.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.02));
      }
      node.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 1000;
      node.connect(filter);
      filter.connect(ctx.destination);
      node.start();
    } else if (type === "win") {
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.08);
        gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + i * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.08);
        osc.stop(ctx.currentTime + i * 0.08 + 0.32);
      });
    } else if (type === "bust") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(80, ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.26);
    }
  } catch (e) {
    // Audio context may be restricted by autoplay policy until user gesture
  }
}

// ── Deck Management ────────────────────────────────────────────────────────
function createDeck() {
  const newDeck = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      newDeck.push({
        rank: rank.rank,
        value: rank.value,
        suit: suit.symbol,
        color: suit.color
      });
    }
  }
  // Shuffle using Fisher-Yates
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
  }
  return newDeck;
}

function drawCard() {
  if (deck.length < 10) {
    deck = createDeck();
  }
  return deck.pop();
}

// ── Hand Score Calculation ─────────────────────────────────────────────────
function calculateScore(hand) {
  let score = 0;
  let aces = 0;

  for (const card of hand) {
    score += card.value;
    if (card.rank === "A") aces++;
  }

  // Convert Aces from 11 to 1 if score exceeds 21
  while (score > 21 && aces > 0) {
    score -= 10;
    aces--;
  }

  return score;
}

// ── UI Rendering ───────────────────────────────────────────────────────────
function updateStatsUI() {
  bankrollEl.textContent = `$${bankroll.toLocaleString()}`;
  currentBetEl.textContent = `$${currentBet.toLocaleString()}`;
  streakEl.textContent = `🔥 ${streak}`;
  localStorage.setItem("rv_bankroll", bankroll.toString());

  if (dealBtn) {
    dealBtn.disabled = currentBet <= 0 || isRoundActive;
  }
}

function renderCardHTML(card, isHidden = false) {
  if (isHidden) {
    return `
      <div class="card card-back">
        <div class="card-back-pattern">👑</div>
      </div>
    `;
  }

  return `
    <div class="card ${card.color}">
      <div class="card-top">
        <span class="card-rank">${card.rank}</span>
        <span class="card-suit">${card.suit}</span>
      </div>
      <div class="card-center">${card.suit}</div>
      <div class="card-bottom">
        <span class="card-rank">${card.rank}</span>
        <span class="card-suit">${card.suit}</span>
      </div>
    </div>
  `;
}

function renderHands() {
  // Render Player Cards
  if (playerHand.length === 0) {
    playerCardsEl.innerHTML = `<div class="card card-placeholder"><span>PLAYER HAND</span></div>`;
    playerScoreEl.textContent = "--";
  } else {
    playerCardsEl.innerHTML = playerHand.map(c => renderCardHTML(c)).join("");
    playerScoreEl.textContent = calculateScore(playerHand);
  }

  // Render Dealer Cards
  if (dealerHand.length === 0) {
    dealerCardsEl.innerHTML = `<div class="card card-placeholder"><span>DEALER HAND</span></div>`;
    dealerScoreEl.textContent = "--";
  } else {
    if (dealerHoleCardRevealed) {
      dealerCardsEl.innerHTML = dealerHand.map(c => renderCardHTML(c)).join("");
      dealerScoreEl.textContent = calculateScore(dealerHand);
    } else {
      // Hide hole card
      dealerCardsEl.innerHTML = renderCardHTML(dealerHand[0]) + renderCardHTML(dealerHand[1], true);
      dealerScoreEl.textContent = dealerHand[0].value === 11 ? "11" : dealerHand[0].value;
    }
  }
}

function setBanner(text, statusClass) {
  bannerMessage.className = `banner-message ${statusClass}`;
  bannerMessage.textContent = text;
}

// ── Betting Controls ───────────────────────────────────────────────────────
function addBet(amount) {
  if (isRoundActive) return;
  if (bankroll >= amount) {
    bankroll -= amount;
    currentBet += amount;
    lastBet = currentBet;
    playSound("chip");
    updateStatsUI();
    setBanner(`BET: $${currentBet} • CLICK DEAL HAND`, "ready");
  } else {
    setBanner("INSUFFICIENT CHIPS!", "bust");
    playSound("bust");
  }
}

function clearBet() {
  if (isRoundActive || currentBet === 0) return;
  bankroll += currentBet;
  currentBet = 0;
  playSound("chip");
  updateStatsUI();
  setBanner("PLACE YOUR BET TO DEAL", "ready");
}

function allIn() {
  if (isRoundActive || bankroll <= 0) return;
  addBet(bankroll);
}

// ── Gameplay Phase ─────────────────────────────────────────────────────────
function dealHand() {
  if (currentBet <= 0 || isRoundActive) return;

  isRoundActive = true;
  dealerHoleCardRevealed = false;
  deck = createDeck();
  playerHand = [];
  dealerHand = [];

  // Deal 2 cards to player and dealer
  playerHand.push(drawCard());
  dealerHand.push(drawCard());
  playerHand.push(drawCard());
  dealerHand.push(drawCard());

  playSound("deal");
  renderHands();

  // Switch UI panels
  bettingControls.classList.add("hidden");
  roundOverControls.classList.add("hidden");
  playingControls.classList.remove("hidden");

  // Can only double down if player has enough bankroll
  if (doubleBtn) {
    doubleBtn.disabled = bankroll < currentBet;
  }

  // Check for immediate natural Blackjacks
  const playerVal = calculateScore(playerHand);
  const dealerVal = calculateScore(dealerHand);

  if (playerVal === 21 || dealerVal === 21) {
    dealerHoleCardRevealed = true;
    renderHands();
    resolveRound();
  } else {
    setBanner("HIT, STAND, OR DOUBLE DOWN", "ready");
  }
}

function hit() {
  if (!isRoundActive) return;

  // Once you hit, double down is disabled
  if (doubleBtn) doubleBtn.disabled = true;

  playerHand.push(drawCard());
  playSound("deal");
  renderHands();

  const playerScore = calculateScore(playerHand);
  if (playerScore > 21) {
    // Player Bust
    dealerHoleCardRevealed = true;
    renderHands();
    resolveRound();
  } else if (playerScore === 21) {
    // Automatically stand on 21
    stand();
  }
}

function doubleDown() {
  if (!isRoundActive || bankroll < currentBet) return;

  // Deduct matching bet
  bankroll -= currentBet;
  currentBet *= 2;
  updateStatsUI();
  playSound("chip");

  // Player gets exactly one card then stands
  playerHand.push(drawCard());
  playSound("deal");
  renderHands();

  dealerHoleCardRevealed = true;
  renderHands();

  if (calculateScore(playerHand) > 21) {
    resolveRound();
  } else {
    dealerPlay();
  }
}

function stand() {
  if (!isRoundActive) return;
  dealerHoleCardRevealed = true;
  renderHands();
  dealerPlay();
}

// ── Dealer Turn ────────────────────────────────────────────────────────────
async function dealerPlay() {
  // Dealer draws until 17 or higher
  while (calculateScore(dealerHand) < 17) {
    await new Promise(r => setTimeout(r, 600));
    dealerHand.push(drawCard());
    playSound("deal");
    renderHands();
  }
  resolveRound();
}

// ── Round Resolution ───────────────────────────────────────────────────────
function resolveRound() {
  isRoundActive = false;
  const pScore = calculateScore(playerHand);
  const dScore = calculateScore(dealerHand);
  const pBlackjack = playerHand.length === 2 && pScore === 21;
  const dBlackjack = dealerHand.length === 2 && dScore === 21;

  let payout = 0;

  if (pBlackjack && !dBlackjack) {
    // Natural Blackjack pays 3:2
    payout = Math.floor(currentBet * 2.5);
    bankroll += payout;
    streak++;
    setBanner(`BLACKJACK! YOU WIN $${payout}!`, "blackjack");
    playSound("win");
  } else if (pBlackjack && dBlackjack) {
    // Push
    bankroll += currentBet;
    setBanner("DOUBLE BLACKJACK! PUSH (TIE)", "push");
  } else if (pScore > 21) {
    // Player Bust
    streak = 0;
    setBanner(`BUST! YOU LOST $${currentBet}`, "bust");
    playSound("bust");
  } else if (dScore > 21) {
    // Dealer Bust
    payout = currentBet * 2;
    bankroll += payout;
    streak++;
    setBanner(`DEALER BUSTS! YOU WIN $${payout}!`, "win");
    playSound("win");
  } else if (pScore > dScore) {
    // Player Wins
    payout = currentBet * 2;
    bankroll += payout;
    streak++;
    setBanner(`YOU WIN! $${payout}`, "win");
    playSound("win");
  } else if (pScore < dScore) {
    // Dealer Wins
    streak = 0;
    setBanner(`DEALER WINS (${dScore} VS ${pScore})`, "bust");
    playSound("bust");
  } else {
    // Push
    bankroll += currentBet;
    setBanner(`PUSH (${pScore} VS ${dScore})`, "push");
  }

  // Reset bet for next round
  currentBet = 0;
  updateStatsUI();

  // If player went broke, replenish $500 free bankroll
  if (bankroll <= 0) {
    bankroll = 500;
    setBanner("OUT OF CHIPS! CASINO GRANTED $500 BONUS!", "ready");
    updateStatsUI();
  }

  // Switch to round over controls
  playingControls.classList.add("hidden");
  roundOverControls.classList.remove("hidden");
}

function newRound() {
  roundOverControls.classList.add("hidden");
  bettingControls.classList.remove("hidden");
  playerHand = [];
  dealerHand = [];
  dealerHoleCardRevealed = false;
  renderHands();
  setBanner("PLACE YOUR BET TO DEAL", "ready");
}

function rebetAndDeal() {
  if (bankroll >= lastBet) {
    newRound();
    addBet(lastBet);
    dealHand();
  } else {
    newRound();
  }
}

// ── Sound Toggle ───────────────────────────────────────────────────────────
soundToggleBtn.addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  soundToggleBtn.textContent = soundEnabled ? "🔊" : "🔇";
});

// ── Initialize on Load ─────────────────────────────────────────────────────
window.addEventListener("DOMContentLoaded", () => {
  deck = createDeck();
  updateStatsUI();
  renderHands();
});
