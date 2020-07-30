//UI Controller
const UICtrl = (function () {
  //UI Selectors
  const UISelectors = {
    //Main screen
    mainScreen: document.querySelector(".app-container"),
    //Buttons
    playBtn: document.getElementById("play-btn"),
    restartBtn: document.getElementById("restart-btn"),

    //Display values
    countdownDisplayValue: document.getElementById('countdown-display-value'),
    chordToPlay: document.getElementById('chord-to-play'),
    intervalDisplayValue: document.getElementById('interval-display-value'),


    //Switch to Chord coach
    chordSpottingSwitchBtn: document.getElementById("chord-spotting-btn"),

    //Feedback
    feedbackOverlay: document.getElementById("feedback-overlay"),
    hideFeedback: document.getElementById("feedback-hide-btn"),
    showFeedback: document.getElementById("show-feedback-btn"),
    feedbackTextInput: document.getElementById("feedback-textarea"),
    submitFeedback: document.getElementById("submit-btn"),

    //Settings
    intervalSetupValue: document.getElementById('interval-setup-value'),
  };

  //Public methods
  return {
    getSelectors: function () {
      return UISelectors;
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
    displayChordsToPlay: function () {
      let random = Math.floor(Math.random() * DataCtrl.getAppData().loadedChords.length);
      if (DataCtrl.getAppData().applicationState === 1) {
        setTimeout(function () {
          if (DataCtrl.getAppData().applicationState === 0) {
            return;
          } else {
            UICtrl.flashChordToPlay();
            UISelectors.chordToPlay.innerText = DataCtrl.getAppData().loadedChords[random];
            //displayChordGrip(loadedChords[random]);
            UICtrl.displayChordsToPlay();
          }
        }, DataCtrl.getAppData().interval * 1000);
      }
    },
    flashChordToPlay: function () {
      UISelectors.chordToPlay.style.opacity = 0;
      setTimeout(function () {
        UISelectors.chordToPlay.style.opacity = 1;
      }, 200);
    },
    displayIntervalValue: function (intervalLength) {
      UISelectors.intervalDisplayValue.textContent = `${intervalLength} s`;
      UISelectors.intervalSetupValue.textContent = `${intervalLength} s`;
    },
  };
})();