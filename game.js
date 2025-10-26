
let cards = [];
let sum = 0;
let hasBlackjack = false;
let isAlive = false;
let message = "";
let messageEl = document.getElementById("message-el");
let sumEl = document.querySelector("#sum-el");
let cardEl = document.querySelector("#cards-el");
const MAX_CARDS = 3; 
let newCardBtn = document.getElementById("newcard-btn");
if (newCardBtn) newCardBtn.disabled = true;

function getRandomCard() {
  let randomNumber = Math.floor(Math.random() * 13) + 1;
  if (randomNumber === 1) return 11;
  if (randomNumber > 10) return 10;
  return randomNumber;
}

function startgame() {
  isAlive = true;
  hasBlackjack = false;
  const firstCard = getRandomCard();
  const secondCard = getRandomCard();
  cards = [firstCard, secondCard];
  sum = cards[0] + cards[1];
  if (newCardBtn) newCardBtn.disabled = false;

  if (messageEl) {
    messageEl.classList.remove('win', 'bust');
  }
  renderGame();
}

function renderGame() {
  if (cardEl) {
    cardEl.textContent = "Cards: ";
    for (let i = 0; i < cards.length; i++) {
      cardEl.textContent += cards[i] + (i < cards.length - 1 ? " " : "");
    }
  }
  if (sumEl) sumEl.textContent = "Sum: " + sum;

  if (sum < 21) {
    message = "Do you want to draw a new card? 😊";
  } else if (sum === 21) {
    message = "Wohoo! You got Blackjack! 😀";
    hasBlackjack = true;
    isAlive = false;
    if (newCardBtn) newCardBtn.disabled = true;
  } else {
    // bust: sum > 21
    message = "You're out of the game. 😒";
    isAlive = false;
    if (newCardBtn) newCardBtn.disabled = true;
  }

  // if reached max cards, enforce end-of-round rules:
  // - if blackjack already handled above
  // - if bust already handled above
  // - otherwise (sum < 21 after drawing MAX_CARDS) the player is out of the game
  if (cards.length >= MAX_CARDS) {
    if (!hasBlackjack && isAlive) {
      // after drawing the max number of cards, player cannot draw more and the round ends
      message = "You're out of the game. 😒";
      isAlive = false;
    }
    if (newCardBtn) newCardBtn.disabled = true;
  }

  if (messageEl) {
    messageEl.textContent = message;
    // add visual state classes
    messageEl.classList.toggle('win', hasBlackjack);
    messageEl.classList.toggle('bust', (!isAlive && !hasBlackjack));
  }
}

function newCard() {
  if (!isAlive || hasBlackjack) return;
  // prevent drawing beyond MAX_CARDS
  if (cards.length >= MAX_CARDS) {
    if (messageEl) messageEl.textContent = "You cannot draw more than " + MAX_CARDS + " cards.";
    if (newCardBtn) newCardBtn.disabled = true;
    return;
  }

  let card = getRandomCard();
  cards.push(card);
  sum += card;
  renderGame();
}
