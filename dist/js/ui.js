//UI Controller
const UICtrl = (function () {
  //UI selectors
  const UISelectors = {
    wrongDisplayTotal: document.getElementById('wrong-display-total'),
    remainingDisplayTotal: document.getElementById('remaining-display-total'),
    correctDisplayTotal: document.getElementById('correct-display-total'),
    chordToRecognizeBtn: document.getElementById('chord-to-recognize-button'),
  };


  //Public methods
  return {
    getSelectors: function () {
      return UISelectors;
    },
    updateWrongDisplayTotal: function (value) {
      UISelectors.wrongDisplayTotal.innerText = value;
    },
    updateRemainingDisplayTotal: function (value) {
      UISelectors.remainingDisplayTotal.innerText = value;
    },
    updateCorrectDisplayTotal: function (value) {
      UISelectors.correctDisplayTotal.innerText = value;
    },
  };
})();