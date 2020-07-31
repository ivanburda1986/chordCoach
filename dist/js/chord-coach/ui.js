//UI Controller
const UICtrl = (function () {
  //Use the public method of DataCtrl to get app data for further re-use in the APP controller here
  const AppData = DataCtrl.getAppData();


  //UI Selectors
  const UISelectors = {
    //Main screen
    mainScreen: document.querySelector(".app-container"),
    //Buttons
    playBtn: document.getElementById("play-btn"),
    pauseBtn: document.getElementById("pause-btn"),
    restartBtn: document.getElementById("restart-btn"),

    //Display values
    countdownDisplayValue: document.getElementById('countdown-display-value'),
    chordToPlay: document.getElementById('chord-to-play'),
    intervalDisplayValue: document.getElementById('interval-display-value'),
    countdownDisplayValue: document.getElementById('countdown-display-value'),

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
    countdownSetupValue: document.getElementById('countdown-setup-value'),
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
      let random = Math.floor(Math.random() * AppData.loadedChords.length);
      if (AppData.applicationState === 1) {
        setTimeout(function () {
          if (AppData.applicationState === 0) {
            return;
          } else {
            UICtrl.flashChordToPlay();
            UISelectors.chordToPlay.innerText = AppData.loadedChords[random];
            //displayChordGrip(loadedChords[random]);
            UICtrl.displayChordsToPlay();
          }
        }, AppData.interval * 1000);
      }
    },
    flashChordToPlay: function () {
      UISelectors.chordToPlay.style.opacity = 0;
      setTimeout(function () {
        UISelectors.chordToPlay.style.opacity = 1;
      }, 200);
    },
    displayIntervalValue: function (intervalLength) {
      UISelectors.intervalDisplayValue.textContent = `${intervalLength}s`;
      //UISelectors.intervalSetupValue.textContent = `${intervalLength}s`;
    },
    displayCountdown: function () {
      UISelectors.countdownDisplayValue.innerText = `${AppData.zerosPrecedingMinutes}${AppData.displayMinutes}:${AppData.zerosPrecedingSeconds}${AppData.displaySeconds}`;
      //UISelectors.countdownSetupValue.innerText = `${AppData.setupMinutes} m`;
    },
    preventMultipleBtnClick: function (clickedButtonId) {
      let target = clickedButtonId;
      target.disabled = true;
      target.style.color = 'grey';
      console.log('disabled');
      setTimeout(function () {
        target.style.color = '#023147';
        target.disabled = false;
        console.log('enabled');
      }, 2000);
    },
    hidePlayBtn: function () {
      UISelectors.playBtn.style.display = "none";
    },
    showPlayBtn: function () {
      UICtrl.preventMultipleBtnClick(UISelectors.playBtn);
      UISelectors.playBtn.style.display = "block";
    },
    hidePauseBtn: function () {
      UISelectors.pauseBtn.style.display = "none";
    },
    showPauseBtn: function () {
      UICtrl.preventMultipleBtnClick(UISelectors.pauseBtn);
      UISelectors.pauseBtn.style.display = "block";
    },
  };
})();