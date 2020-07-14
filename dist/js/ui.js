//UI Controller
const UICtrl = (function () {
  //UI selectors
  const UISelectors = {
    wrongDisplayTotal: document.getElementById('wrong-display-total'),
    remainingDisplayTotal: document.getElementById('remaining-display-total'),
    correctDisplayTotal: document.getElementById('correct-display-total'),
    primaryActionBtn: document.querySelector('.primary-action-button'),
    primaryActionIcon: document.getElementById('primary-action-graphics'),
    primaryActionText: document.getElementById('primary-action-text'),
    confirmBtn: document.getElementById('confirm-btn'),
    restartBtn: document.getElementById('restart-btn'),
    showSettingsBtn: document.getElementById('show-settings-btn'),
    hideSettingsBtn: document.getElementById('settings-hide-btn'),
    settingsOverlay: document.getElementById('settings-overlay'),
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
        option.parentNode.classList.remove('selected');
      });
      if (clickedObject) {
        clickedObject.classList.add('selected');
      }
    },
    unHighlightSelectedAnswer: function (clickedObject) {
      document.getElementsByName('chordOption').forEach((option) => {
        option.parentNode.classList.remove('selected');
      });
    },
    highlightCorrectAnswer: function () {
      document.getElementById(DataCtrl.getAppData().currentChord).parentNode.classList.add('correct');
    },
    unHighlightCorrectAnswer: function () {
      document.querySelectorAll('.chord-option').forEach((option) => {
        option.classList.remove("correct");
      });
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
    makeAnswerOptionsInactive: function () {
      document.querySelectorAll('.chord-option').forEach((option) => {
        if (option.classList.contains('selected')) {
          option.children[0].disabled = true;
        } else {
          option.children[0].disabled = true;
          option.classList.add("inactive");
        }
      });
    },
    makeAnswerOptionsActive: function () {
      document.querySelectorAll('.chord-option').forEach((option) => {
        option.children[0].disabled = false;
        option.classList.remove("inactive");
      });
    },
    makeConfirmBtnInactive: function () {
      UISelectors.confirmBtn.disabled = true;
      UISelectors.confirmBtn.classList.remove('confirm');
      UISelectors.confirmBtn.classList.add('inactive');
    },
    makeConfirmBtnActive: function () {
      UISelectors.confirmBtn.disabled = false;
      UISelectors.confirmBtn.classList.remove('inactive');
      UISelectors.confirmBtn.classList.add('confirm');
    },
    makeRestartBtnInactive: function () {
      UISelectors.restartBtn.disabled = true;
      UISelectors.restartBtn.classList.remove('restart');
      UISelectors.restartBtn.classList.add('inactive');
    },
    makeRestartBtnActive: function () {
      UISelectors.restartBtn.disabled = false;
      UISelectors.restartBtn.classList.remove('inactive');
      UISelectors.restartBtn.classList.add('restart');
    },
    makeMainBtnInactive: function () {
      UISelectors.primaryActionBtn.disabled = true;
      UISelectors.primaryActionBtn.classList.add('inactive');
    },
    makeMainBtnActive: function () {
      UISelectors.primaryActionBtn.disabled = false;
      UISelectors.primaryActionBtn.classList.remove('inactive');
    },
    showSettings: function () {
      UISelectors.settingsOverlay.classList.add('show');
      UISelectors.settingsOverlay.classList.remove('hide');
    },
    hideSettings: function () {
      UISelectors.settingsOverlay.classList.add('hide');
      UISelectors.settingsOverlay.classList.remove('show');
    },
    highlightChordSetup: function (clickedChord) {
      if (clickedChord.target.classList.contains('individual-chord-label')) {
        if (clickedChord.target.parentNode.children[0].checked) {
          clickedChord.target.parentNode.classList.remove('selected');
        } else {
          clickedChord.target.parentNode.classList.add('selected');
        }
      }
    }
  };
})();