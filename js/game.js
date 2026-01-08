(function () {
  // ---- WORD POOL ----
  var WORDS = [
    "planet", "music", "silver", "yellow", "window",
    "school", "browser", "javascript", "hangman", "cookie",
    "future", "puzzle", "camera", "dragon", "garden",
    "castle", "rocket", "forest", "summer", "island"
  ];

  // computer hangman pictures
  var HANGMAN_STAGES = [
`  +---+
  |   |
      |
      |
      |
      |
=========`,
`  +---+
  |   |
  O   |
      |
      |
      |
=========`,
`  +---+
  |   |
  O   |
  |   |
      |
      |
=========`,
`  +---+
  |   |
  O   |
 /|   |
      |
      |
=========`,
`  +---+
  |   |
  O   |
 /|\  |
      |
      |
=========`,
`  +---+
  |   |
  O   |
 /|\  |
 /    |
      |
=========`,
`  +---+
  |   |
  O   |
 /|\  |
 / \  |
      |
=========`
  ];

  // ---- DOM elements ----
  var wordDisplay = document.getElementById("wordDisplay");
  var usedLettersEl = document.getElementById("usedLetters");
  var mistakesEl = document.getElementById("mistakes");
  var maxMistakesEl = document.getElementById("maxMistakes");
  var guessCountEl = document.getElementById("guessCount");
  var hangmanArtEl = document.getElementById("hangmanArt");
  var messageEl = document.getElementById("message");
  var infoTextEl = document.getElementById("infoText");
  var newGameBtn = document.getElementById("newGameBtn");
  var bestScoreGameEl = document.getElementById("bestScoreGame");

  // ---- Game state ----
  var maxMistakes = 6;
  var word = "";
  var guessed = []; // correct letters
  var wrong = [];   // wrong letters

  updateBestScoreUI();
  startNewGame();

  // Keyboard-only guessing
  document.addEventListener("keydown", function (e) {
    var letter = e.key.toLowerCase();

    // Only accept a-z
    if (letter.length !== 1) return;
    if (letter < "a" || letter > "z") return;

    handleGuess(letter);
  });

  newGameBtn.addEventListener("click", function () {
    startNewGame();
  });

  // ---------------- FUNCTIONS ----------------

  function startNewGame() {
    word = pickRandomWord();
    guessed = [];
    wrong = [];
    renderEverything();
    setMessage("New game started. Type letters A–Z to guess!", false);
  }

  function pickRandomWord() {
    var idx = Math.floor(Math.random() * WORDS.length);
    return WORDS[idx].toLowerCase();
  }

  function handleGuess(letter) {
    if (isWin() || isLose()) return;

    // Already used? ignore
    if (guessed.indexOf(letter) !== -1 || wrong.indexOf(letter) !== -1) {
      setMessage("You already used '" + letter.toUpperCase() + "'.", true);
      return;
    }

    if (word.indexOf(letter) !== -1) {
      guessed.push(letter);
      setMessage("Nice! '" + letter.toUpperCase() + "' is in the word.", false);
    } else {
      wrong.push(letter);
      setMessage("Nope! '" + letter.toUpperCase() + "' is not in the word.", true);
    }

    renderEverything();

    if (isWin()) onWin();
    if (isLose()) onLose();
  }

  function renderEverything() {
    wordDisplay.textContent = getMaskedWord();

    mistakesEl.textContent = wrong.length;
    maxMistakesEl.textContent = maxMistakes;

    hangmanArtEl.textContent = HANGMAN_STAGES[wrong.length];

    guessCountEl.textContent = getGuessCount();

    infoTextEl.textContent = "Word length: " + word.length;

    usedLettersEl.textContent = getUsedLettersText();
  }

  function getUsedLettersText() {
    var used = guessed.concat(wrong);
    used.sort();

    if (used.length === 0) return "—";

    var out = [];
    for (var i = 0; i < used.length; i++) {
      out.push(used[i].toUpperCase());
    }
    return out.join(", ");
  }

  function getMaskedWord() {
    var out = [];
    for (var i = 0; i < word.length; i++) {
      var ch = word[i];
      out.push(guessed.indexOf(ch) !== -1 ? ch.toUpperCase() : "_");
    }
    return out.join(" ");
  }

  function getGuessCount() {
    return guessed.length + wrong.length;
  }

  function isWin() {
    for (var i = 0; i < word.length; i++) {
      if (guessed.indexOf(word[i]) === -1) return false;
    }
    return true;
  }

  function isLose() {
    return wrong.length >= maxMistakes;
  }

  function onWin() {
    var score = getGuessCount();
    setMessage("You WIN! Score: " + score + " guesses. 🎉", false);

    var best = localStorage.getItem("hangmanBestScore");
    if (best === null || score < Number(best)) {
      localStorage.setItem("hangmanBestScore", String(score));
      updateBestScoreUI();
      setMessage("You WIN! New BEST score: " + score + " guesses! 🎉", false);
    }
  }

  function onLose() {
    setMessage("You lose! The word was: " + word.toUpperCase() + " 😢", true);
  }

  function setMessage(text, isWarning) {
    messageEl.textContent = text;
    messageEl.style.color = isWarning ? "#ffb4b4" : "";
  }

  function updateBestScoreUI() {
    var best = localStorage.getItem("hangmanBestScore");
    bestScoreGameEl.textContent = (best === null) ? "—" : best;
  }
})();