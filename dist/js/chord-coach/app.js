//App controller
const App = (function (DataCtrl, UICtrl) {
  //Use the public method of DataCtrl to get app data for further re-use in the APP controller here
  const AppData = DataCtrl.getAppData();
  const SoundSelectors = DataCtrl.getSoundSelectors();
  const UISelectors = UICtrl.getSelectors();

  //EVENT LISTENERS
  const loadEventListeners = function () {
    //Switch to Chord coach
    UISelectors.chordSpottingSwitchBtn.addEventListener("click", () => {
      window.open("index.html", "_self");
    });

    //Show feedback form
    UISelectors.showFeedback.addEventListener("click", UICtrl.showFeedback);

    //Hide feedback form
    UISelectors.hideFeedback.addEventListener("click", UICtrl.hideFeedback);

    //Evaluate state of the Submit-feedback button
    UISelectors.feedbackTextInput.addEventListener("keyup", function () {
      if (UISelectors.feedbackTextInput.value != "") {
        UISelectors.submitFeedback.classList.remove("inactive");
        UISelectors.submitFeedback.disabled = false;
      } else {
        UISelectors.submitFeedback.classList.add("inactive");
        UISelectors.submitFeedback.disabled = true;
      }
    });

    //Show settings
    UISelectors.showSettings.addEventListener("click", UICtrl.showSettings);

    //Hide settings
    UISelectors.hideSettings.addEventListener("click", UICtrl.hideSettings);

    //Start the training
    UISelectors.playBtn.addEventListener("click", (e) => {
      App.start();
      e.preventDefault();
    });
    //Pause the training
    UISelectors.pauseBtn.addEventListener("click", (e) => {
      App.pause();
      e.preventDefault();
    });
    //Restart the training
    UISelectors.restartBtn.addEventListener("click", (e) => {
      App.restart();
    });
    //Select chord groups x individual chords
    UISelectors.chordGroups.forEach((group) => {
      group.addEventListener('click', (e) => {
        if (group.children[0].checked === true) {
          group.classList.add('selected');
        } else if (group.children[0].checked === false) {
          group.classList.remove('selected');
        }
        UICtrl.clearIndividuals();
        UICtrl.checkApplySettingsButtonState();
      })
    });
    UISelectors.individualChords.forEach((chord) => {
      chord.addEventListener('click', (e) => {
        if (chord.children[0].checked === true) {
          chord.classList.add('selected');
        } else if (chord.children[0].checked === false) {
          chord.classList.remove('selected');
        }
        UICtrl.clearGroups();
        UICtrl.checkApplySettingsButtonState();
      })
    });
    //Increase countdown setup
    UISelectors.countdownIncreaseBtn.addEventListener('click', (e) => {
      AppData.displayMinutes += 1;
      AppData.setupMinutes = AppData.displayMinutes;
      AppData.displaySeconds = 0;
      precedingSeconds();
      precedingMinutes();
      UICtrl.displayCountdown();
      UICtrl.checkIncreaseDecreaseCountdownButtonState();
    });
    //Decrease countdown setup
    UISelectors.countdownDecreaseBtn.addEventListener('click', (e) => {
      AppData.displayMinutes -= 1;
      AppData.setupMinutes = AppData.displayMinutes;
      AppData.displaySeconds = 0;
      precedingMinutes();
      precedingSeconds();
      UICtrl.displayCountdown();
      UICtrl.checkIncreaseDecreaseCountdownButtonState();
    });
    //Increase interval setup
    UISelectors.intervalIncreaseBtn.addEventListener('click', (e) => {
      AppData.interval += 1;
      UICtrl.displayIntervalValue(AppData.interval);
      UICtrl.checkIncreaseDecreaseIntervalButtonsState();
    });
    //Decrease interval setup
    UISelectors.intervalDecreaseBtn.addEventListener('click', (e) => {
      AppData.interval -= 1;
      UICtrl.displayIntervalValue(AppData.interval);
      UICtrl.checkIncreaseDecreaseIntervalButtonsState();
    });

    //Select the grip display mode
    UISelectors.gripSetupModes.forEach((mode) => {
      mode.addEventListener('click', (e) => {
        let clickedOption = mode.parentNode.children[0];
        UICtrl.clearGripSetupModes();
        clickedOption.checked = true;
        mode.parentNode.classList.add('selected');
        DataCtrl.saveGripModeToLocalStorage(clickedOption.value);
        DataCtrl.getAppData().selectedGripMode = clickedOption.value;
        e.preventDefault();
      })
    });
  };

  //PRIVATE METHODS
  //Countdown the time
  const deductTime = function () {
    if (AppData.displaySeconds === 0) {
      AppData.displaySeconds = 60;
      AppData.displayMinutes -= 1;
    }
    AppData.displaySeconds -= 1;
  };

  const precedingMinutes = function () {
    if (AppData.displayMinutes < 10) {
      AppData.zerosPrecedingMinutes = 0;
    } else {
      AppData.zerosPrecedingMinutes = "";
    }
  };

  const precedingSeconds = function () {
    if (AppData.displaySeconds < 10) {
      AppData.zerosPrecedingSeconds = 0;
    } else {
      AppData.zerosPrecedingSeconds = "";
    }
  };

  const resetCountdown = function () {
    AppData.displayMinutes = AppData.setupMinutes;
    AppData.displaySeconds = 0;
    AppData.applicationState = 0;
    precedingSeconds();
    precedingMinutes();
    UICtrl.displayCountdown();
  };

  const alarm = function () {
    if (AppData.displayMinutes === 0 && AppData.displaySeconds === 0) {
      AppData.applicationState = 0;
      SoundSelectors.audio.src = "sounds/alarm.mp3";
      SoundSelectors.audio.play();
      UICtrl.visualAlarm(4);
      resetCountdown();
      UICtrl.showPlayBtn("dontPrevent");
      UICtrl.hidePauseBtn();
      UICtrl.makeRestartBtnInactive();
    }
  };

  const countdownTheTime = function () {
    if (AppData.applicationState === 1) {
      setTimeout(function () {
        if (AppData.applicationState === 0) {
          return;
        } else {
          deductTime(); //request time decrease
          precedingSeconds(); //to make sure the seconds are displaying with a preceding zero when needed
          precedingMinutes(); //to make sure the minutes are displaying with a preceding zero when needed
          UICtrl.displayCountdown(); //to refresh the display
          countdownTheTime(); //recursive calling
          UICtrl.checkIncreaseDecreaseCountdownButtonState();
          alarm();
        }
      }, 1000);
    }
  };

  const displayFullYear = function () {
    const fullYear = new Date().getFullYear();
    UISelectors.footerYear.textContent = fullYear;
  }


  //PUBLIC METHODS
  return {
    init: function () {
      loadEventListeners();
      //Set default data
      DataCtrl.setDefaultData();

      //Manage buttons
      UICtrl.hidePauseBtn();
      UICtrl.makeRestartBtnInactive();

      //Set the year in the footer
      displayFullYear();

      //Set the interval
      AppData.interval = DataCtrl.getIntervalFromLocalStorage();
      UICtrl.displayIntervalValue(DataCtrl.getAppData().interval);

      //Reset the countdown
      AppData.displayMinutes = DataCtrl.getSetupMinutesFromLocalStorage();
      AppData.setupMinutes = DataCtrl.getSetupMinutesFromLocalStorage();
      resetCountdown();

      //Set grip mode
      DataCtrl.getAppData().selectedGripMode = DataCtrl.getGripModeFromLocalStorage();
      UICtrl.highlightOnLoadSelectedGripMode();

      //Display on the overview correct chord and grip based on the current chord selection
      AppData.loadedChords = DataCtrl.getSelectedChordsFromLocalStorage();
      UICtrl.manageChordAndGripDisplay();
      UICtrl.displayChordGripInSelectedMode(DataCtrl.getAppData().selectedGripMode);

      //Settings overlay: Set as selected the groups/individual chords based on the initialised set
      UICtrl.highlightOnLoadSelectedChords();

      //Manage initial button states
      UICtrl.checkApplySettingsButtonState();
      UICtrl.checkIncreaseDecreaseCountdownButtonState();
      UICtrl.checkIncreaseDecreaseIntervalButtonsState();
    },
    start: function () {
      AppData.applicationState = 1;
      SoundSelectors.audio.src = `sounds/click.mp3`;
      SoundSelectors.audio.play();
      UICtrl.displayChordsToPlay();
      UICtrl.showPauseBtn();
      UICtrl.hidePlayBtn();
      UICtrl.makeRestartBtnActive();
      countdownTheTime();
    },
    pause: function () {
      AppData.applicationState = 0;
      SoundSelectors.audio.src = `sounds/click.mp3`;
      SoundSelectors.audio.play();
      UICtrl.displayChordsToPlay();
      UICtrl.showPlayBtn();
      UICtrl.hidePauseBtn();
      countdownTheTime();
    },
    restart: function () {
      SoundSelectors.audio.src = `sounds/start.mp3`;
      SoundSelectors.audio.play();
      resetCountdown();
      UICtrl.showPlayBtn("dontPrevent");
      UICtrl.hidePauseBtn();
      UICtrl.makeRestartBtnInactive();
      UICtrl.manageChordAndGripDisplay();
      UICtrl.flashChordGrip();
      UICtrl.displayChordGripInSelectedMode(DataCtrl.getAppData().selectedGripMode);
      UICtrl.triggerAnimation("#countdown-display", "anim-pop-in-out");
    },
  };
})(DataCtrl, UICtrl);

//Initialize the app
App.init();