//UI Controller
const UICtrl = (function () {
  //UI selectors
  const UISelectors = {
    wrongDisplayTotal: document.getElementById('wrong-display-total'),
    remainingDisplayTotal: document.getElementById('remaining-display-total'),
    correctDisplayTotal: document.getElementById('correct-display-total'),
    primaryActionBtn: document.getElementById('primary-action-button'),
    primaryActionIcon: document.getElementById('primary-action-graphics'),
    primaryActionText: document.getElementById('primary-action-text'),
    confirmBtn: document.getElementById('confirm-btn'),
    restartBtn: document.getElementById('restart-btn'),
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
    highlightSelectedAnswer: function (clickedObject) {
      document.getElementsByName('chordOption').forEach((option) => {
        option.parentNode.style.background = "#4D648D";
      });
      if (clickedObject) {
        clickedObject.style.background = "orange";
      }
    },
    clearAnswer: function () {
      document.getElementsByName('chordOption').forEach((item) => {
        item.checked = false;
      })
    },
    setMainBtnState: function () {
      switch (DataCtrl.getAppData().appState) {
        case "readyToStart":
          UISelectors.primaryActionIcon.classList.value = "fas fa-play";
          UISelectors.primaryActionText.innerText = "Start";
          break;
        case "playNext":
          UISelectors.primaryActionIcon.classList.value = "fas fa-play";
          UISelectors.primaryActionText.innerText = "Next";
          break;
        case "playing":
          UISelectors.primaryActionIcon.classList.value = "fas fa-music";
          UISelectors.primaryActionText.innerText = "Playing";
          break;
        case "repeat":
          UISelectors.primaryActionIcon.classList.value = "fas fa-redo-alt";
          UISelectors.primaryActionText.innerText = "Repeat";
          break;
        case "finished-victory":
          UISelectors.primaryActionIcon.classList.value = "fas fa-medal";
          UISelectors.primaryActionText.innerText = "Awesome!";
          break;
        case "finished-standard":
          UISelectors.primaryActionIcon.classList.value = "far fa-smile-wink";
          UISelectors.primaryActionText.innerText = "Getting there...";
          break;
      }
    },
    setButtonState: function (buttonName, stateToSet) {
      if (stateToSet === "enabled") {
        UISelectors[buttonName].disabled = false;
        UISelectors[buttonName].classList.remove("disabled");
        UISelectors[buttonName].classList.add("enabled");
      } else if (stateToSet === "disabled") {
        UISelectors[buttonName].disabled = true;
        UISelectors[buttonName].classList.remove("enabled");
        UISelectors[buttonName].classList.add("disabled");
      }
    }
  };
})();