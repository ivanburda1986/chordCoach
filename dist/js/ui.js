//UI Controller
const UICtrl = (function () {
  //UI selectors
  const UISelectors = {
    wrongDisplayTotal: document.getElementById('wrong-display-total'),
    remainingDisplayTotal: document.getElementById('remaining-display-total'),
    correctDisplayTotal: document.getElementById('correct-display-total'),
    chordToRecognizeBtn: document.getElementById('chord-to-recognize-button'),
    confirmBtn: document.getElementById('confirm-btn'),

  };


  //Public methods
  return {
    getSelectors: function () {
      return UISelectors;
    },
    updateWrongDisplayTotal: function () {
      UISelectors.wrongDisplayTotal.innerText = DataCtrl.getAppData().wrongTotal;
    },
    updateRemainingDisplayTotal: function () {
      UISelectors.remainingDisplayTotal.innerText = DataCtrl.getAppData().remainingTotal;
    },
    updateCorrectDisplayTotal: function () {
      UISelectors.correctDisplayTotal.innerText = DataCtrl.getAppData().correctTotal;
    },
    clearAnswer: function () {
      document.getElementsByName('chordOption').forEach((item) => {
        console.log(item.checked = false);
      })
    }
  };
})();