//UI Controller
const UICtrl = (function () {
  //UI selectors
  const UISelectors = {
    //Main screen
    mainScreen: document.querySelector(".app-container"),
    wrongDisplayTotal: document.getElementById("wrong-display-total"),
    remainingDisplayTotal: document.getElementById("remaining-display-total"),
    correctDisplayTotal: document.getElementById("correct-display-total"),
    primaryActionBtn: document.querySelector(".primary-action-button"),
    primaryActionIcon: document.getElementById("primary-action-graphics"),
    primaryActionText: document.getElementById("primary-action-text"),
    confirmBtn: document.getElementById("confirm-btn"),
    restartBtn: document.getElementById("restart-btn"),
    //Switch to Chord coach
    chordCoachSwitchBtn: document.getElementById("chord-coach-btn"),
    //Settings
    showSettingsBtn: document.getElementById("show-settings-btn"),
    hideSettingsBtn: document.getElementById("settings-hide-btn"),
    settingsOverlay: document.getElementById("settings-overlay"),
    settingsHeadlineText: document.getElementById("settings-headline-text"),
    answerSetContainer: document.getElementById("chord-options"),
    allSettingsChords: document.getElementById("individual-chords"),
    hardcoreBtn: document.getElementById("hardcore-btn-container"),
    //Feedback
    feedbackOverlay: document.getElementById("feedback-overlay"),
    hideFeedback: document.getElementById("feedback-hide-btn"),
    showFeedback: document.getElementById("show-feedback-btn"),
    feedbackTextInput: document.getElementById("feedback-textarea"),
    submitFeedback: document.getElementById("submit-btn"),
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
      document.getElementsByName("chordOption").forEach((option) => {
        option.parentNode.classList.remove("selected");
      });
      if (clickedObject) {
        clickedObject.classList.add("selected");
      }
    },
    unHighlightSelectedAnswer: function (clickedObject) {
      document.getElementsByName("chordOption").forEach((option) => {
        option.parentNode.classList.remove("selected");
      });
    },
    highlightCorrectAnswer: function () {
      document
        .getElementById(`answer-${DataCtrl.getAppData().currentChord}`)
        .parentNode.classList.add("correct");
    },
    unHighlightCorrectAnswer: function () {
      document.querySelectorAll(".chord-option").forEach((option) => {
        option.classList.remove("correct");
      });
    },
    clearAnswer: function () {
      document.getElementsByName("chordOption").forEach((item) => {
        item.checked = false;
      });
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
      document.querySelectorAll(".chord-option").forEach((option) => {
        if (option.classList.contains("selected")) {
          option.children[0].disabled = true;
        } else {
          option.children[0].disabled = true;
          option.classList.add("inactive");
        }
      });
    },
    makeAnswerOptionsActive: function () {
      document.querySelectorAll(".chord-option").forEach((option) => {
        option.children[0].disabled = false;
        option.classList.remove("inactive");
      });
    },
    makeConfirmBtnInactive: function () {
      UISelectors.confirmBtn.disabled = true;
      UISelectors.confirmBtn.classList.remove("confirm");
      UISelectors.confirmBtn.classList.add("inactive");
    },
    makeConfirmBtnActive: function () {
      UISelectors.confirmBtn.disabled = false;
      UISelectors.confirmBtn.classList.remove("inactive");
      UISelectors.confirmBtn.classList.add("confirm");
    },
    makeRestartBtnInactive: function () {
      UISelectors.restartBtn.disabled = true;
      UISelectors.restartBtn.classList.remove("restart");
      UISelectors.restartBtn.classList.add("inactive");
    },
    makeRestartBtnActive: function () {
      UISelectors.restartBtn.disabled = false;
      UISelectors.restartBtn.classList.remove("inactive");
      UISelectors.restartBtn.classList.add("restart");
    },
    makeMainBtnInactive: function () {
      UISelectors.primaryActionBtn.disabled = true;
      UISelectors.primaryActionBtn.classList.add("inactive");
    },
    makeMainBtnActive: function () {
      UISelectors.primaryActionBtn.disabled = false;
      UISelectors.primaryActionBtn.classList.remove("inactive");
    },
    showSettings: function () {
      UISelectors.settingsOverlay.classList.add("show");
      UISelectors.settingsOverlay.classList.remove("hide");
      UISelectors.mainScreen.classList.add("hide");
      Array.from(document.getElementsByClassName("individual-chord")).forEach(
        (chord) => {
          chord.children[0].style.visibility = "visible";
        }
      );
    },
    hideSettings: function () {
      UISelectors.settingsOverlay.classList.add("hide");
      UISelectors.settingsOverlay.classList.remove("show");
      UISelectors.mainScreen.classList.remove("hide");
      Array.from(document.getElementsByClassName("individual-chord")).forEach(
        (chord) => {
          chord.children[0].style.visibility = "hidden";
        }
      );
    },
    displaySettingsHeadline: function () {
      UISelectors.settingsHeadlineText.innerText = `Select from ${
        DataCtrl.getAppData().minChordsForTraining
      } to ${DataCtrl.getAppData().maxChordsForTraining} chords`;
    },
    displayAnswerSet: function () {
      UISelectors.answerSetContainer.innerHTML = "";
      DataCtrl.getAppData().loadedChords.forEach((chord) => {
        const div = document.createElement("div");
        div.className = "chord-option";
        div.innerHTML = `<input type="radio" name="chordOption" value="${chord}" id="answer-${chord}"/><label
        class="chord-option-label" for="answer-${chord}">${chord}</label>`;
        document.getElementById("chord-options").appendChild(div);
      });
    },
    triggerAnimation: function (target, animationName) {
      document.querySelector(target).classList.add(`${animationName}`);
      setTimeout(() => {
        document.querySelector(target).classList.remove(`${animationName}`);
      }, 500);
    },
    highlightSettingsSelection: function () {
      DataCtrl.getAppData().loadedChords.forEach((chord) => {
        document.getElementById(`${chord}`).checked = true;
        document
          .getElementById(`${chord}`)
          .parentNode.classList.add("selected");
      });
    },
    highlightDifficulty: function () {
      if (DataCtrl.getAppData().hardcore === "on") {
        UISelectors.hardcoreBtn.classList.add("hardcore-on");
        UISelectors.hardcoreBtn.children[0].checked = true;
      } else {
        UISelectors.hardcoreBtn.classList.remove("hardcore-on");
      }
    },
    showFeedback: function () {
      UISelectors.feedbackOverlay.classList.add("show");
      UISelectors.feedbackOverlay.classList.remove("hide");
      UISelectors.mainScreen.classList.add("hide");
    },
    hideFeedback: function () {
      UISelectors.feedbackOverlay.classList.add("hide");
      UISelectors.feedbackOverlay.classList.remove("show");
      UISelectors.mainScreen.classList.remove("hide");
    },
  };
})();