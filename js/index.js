
(function () {
  var bestScoreEl = document.getElementById("bestScore");
  var resetBtn = document.getElementById("resetBtn");

  var bestScore = localStorage.getItem("hangmanBestScore");

  bestScoreEl.textContent = (bestScore === null) ? "—" : bestScore;

  resetBtn.addEventListener("click", function () {
    localStorage.removeItem("hangmanBestScore");
    bestScoreEl.textContent = "—";
  });
})();
