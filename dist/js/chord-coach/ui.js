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
    countdownDisplay: document.getElementById('countdown-display'),
    countdownDisplayValue: document.getElementById('countdown-display-value'),
    chordToPlay: document.getElementById('chord-to-play'),
    intervalDisplayValue: document.getElementById('interval-display-value'),
    countdownDisplayValue: document.getElementById('countdown-display-value'),

    //Switch to Chord coach
    chordSpottingSwitchBtn: document.getElementById("chord-spotting-btn"),

    //Fingers
    finger1: document.getElementById('finger1'),
    finger1bar: document.getElementById('finger1bar'),
    finger2: document.getElementById('finger2'),
    finger3: document.getElementById('finger3'),
    finger4: document.getElementById('finger4'),
    thumb: document.getElementById('thumb'),

    //String soundings
    sounding1: document.getElementById('sounding-string1'),
    sounding2: document.getElementById('sounding-string2'),
    sounding3: document.getElementById('sounding-string3'),
    sounding4: document.getElementById('sounding-string4'),
    sounding5: document.getElementById('sounding-string5'),
    sounding6: document.getElementById('sounding-string6'),

    //Footer
    footerYear: document.getElementById('footer-year'),

    //Feedback
    feedbackOverlay: document.getElementById("feedback-overlay"),
    hideFeedback: document.getElementById("feedback-hide-btn"),
    showFeedback: document.getElementById("show-feedback-btn"),
    feedbackTextInput: document.getElementById("feedback-textarea"),
    submitFeedback: document.getElementById("submit-btn"),

    //Settings
    settingsOverlay: document.getElementById("settings-overlay"),
    hideSettings: document.getElementById("settings-hide-btn"),
    showSettings: document.getElementById("show-settings-btn"),
    chordGroups: document.querySelectorAll('.chord-group'),
    individualChords: document.querySelectorAll('.individual-chord'),
    chordGroupCheckboxes: document.getElementsByName('chordGroup'),
    individualChordCheckboxes: document.getElementsByName('individualChord'),
    intervalSetupValue: document.getElementById('interval-setup-value'),
    countdownSetupValue: document.getElementById('countdown-setup-value'),
    countdownIncreaseBtn: document.getElementById('countdown-increase-btn'),
    countdownDecreaseBtn: document.getElementById('countdown-decrease-btn'),
    intervalIncreaseBtn: document.getElementById('interval-increase-btn'),
    intervalDecreaseBtn: document.getElementById('interval-decrease-btn'),

  };

  //Private methods
  const confirmSelectedChords = function () {
    AppData.loadedChords = [];
    //Get individual chords which are selected
    let selectedIndividualChords = [];
    UISelectors.individualChordCheckboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        selectedIndividualChords.push(checkbox.value);
      }
    });
    //Get chord groups which are selected
    let detailsFromCheckedGroups = [];
    let checkedGroups = [];
    let chordsFromCheckedGroupsTogether = [];
    UISelectors.chordGroupCheckboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        checkedGroups.push(checkbox.value);
      }
    })
    checkedGroups.forEach((group) => {
      detailsFromCheckedGroups.push(DataCtrl.getAllChords()[group])
    })
    detailsFromCheckedGroups.forEach((item) => {
      chordsFromCheckedGroupsTogether = chordsFromCheckedGroupsTogether.concat(item);
    })
    //Apply the selection of individual chords / chords groups
    AppData.loadedChords = selectedIndividualChords.concat(chordsFromCheckedGroupsTogether);
    //Save what type of selection was made (chord groups vs. individual chords)
    if (selectedIndividualChords <= 0) {
      DataCtrl.saveSelectionTypeToLocalStorage("groups");
    } else {
      DataCtrl.saveSelectionTypeToLocalStorage("individualChords");
    }
  };

  //Public methods
  return {
    getSelectors: function () {
      return UISelectors;
    },
    //Feedback
    showFeedback: function () {
      UISelectors.feedbackOverlay.classList.add("show");
      UISelectors.feedbackOverlay.classList.remove("hide");
      UISelectors.mainScreen.classList.add("hide");
      App.pause();
    },
    hideFeedback: function () {
      UISelectors.feedbackOverlay.classList.add("hide");
      UISelectors.feedbackOverlay.classList.remove("show");
      UISelectors.mainScreen.classList.remove("hide");
    },
    //Settings
    showSettings: function () {
      UISelectors.settingsOverlay.classList.add("show");
      UISelectors.settingsOverlay.classList.remove("hide");
      UISelectors.mainScreen.classList.add("hide");
      App.pause();
    },
    hideSettings: function () {
      UISelectors.settingsOverlay.classList.add("hide");
      UISelectors.settingsOverlay.classList.remove("show");
      UISelectors.mainScreen.classList.remove("hide");
      confirmSelectedChords();
      UICtrl.manageChordAndGripDisplay();
      DataCtrl.saveIntervalToLocalStorage(AppData.interval);
      DataCtrl.saveSetupMinutesToLocalStorage(AppData.setupMinutes);
      DataCtrl.saveSelectedChordsToLocalStorage(AppData.loadedChords);
      App.restart();
    },
    clearGroups: function () {
      UISelectors.chordGroupCheckboxes.forEach((group) => {
        group.checked = false;
      });
      UISelectors.chordGroups.forEach((group) => {
        group.classList.remove('selected');
      });
    },
    clearIndividuals: function () {
      UISelectors.individualChordCheckboxes.forEach((individual) => {
        individual.checked = false;
      })
      UISelectors.individualChords.forEach((chord) => {
        chord.classList.remove('selected');
      });
    },
    checkApplySettingsButtonState: function () {
      //Allow applying settings only after making sure that:
      //--Either at least 1 group of chords is selected
      let selectedGroups = [];
      UISelectors.chordGroupCheckboxes.forEach((checkbox) => {
        if (checkbox.checked) {
          selectedGroups.push(checkbox.value);
        }
      });

      //--Or at least 3 individual chords are selected
      let selectedIndividualChords = [];
      UISelectors.individualChordCheckboxes.forEach((checkbox) => {
        if (checkbox.checked) {
          selectedIndividualChords.push(checkbox.value);
        }
      });

      //Enable the button to apply settings
      if (selectedGroups.length > 0 || selectedIndividualChords.length >= 3) {
        UISelectors.hideSettings.disabled = false;
        UISelectors.hideSettings.classList.add('enabled');
        UISelectors.hideSettings.classList.remove('disabled');
      } else {
        UISelectors.hideSettings.disabled = true;
        UISelectors.hideSettings.classList.remove('enabled');
        UISelectors.hideSettings.classList.add('disabled');
      }
    },
    //Manage countdown button states
    checkIncreaseDecreaseCountdownButtonState: function () {
      if (AppData.setupMinutes === 10) {
        UISelectors.countdownIncreaseBtn.disabled = true;
      }
      if (AppData.setupMinutes === 9) {
        UISelectors.countdownIncreaseBtn.disabled = false;
      }
      if (AppData.setupMinutes === 1) {
        UISelectors.countdownDecreaseBtn.disabled = true;
      }
      if (AppData.setupMinutes === 2) {
        UISelectors.countdownDecreaseBtn.disabled = false;
      }
    },
    //Manage interval button states
    checkIncreaseDecreaseIntervalButtonsState: function () {
      if (AppData.interval === 10) {
        UISelectors.intervalIncreaseBtn.disabled = true;
      }
      if (AppData.interval === 9) {
        UISelectors.intervalIncreaseBtn.disabled = false;
      }
      if (AppData.interval === 1) {
        UISelectors.intervalDecreaseBtn.disabled = true;
      }
      if (AppData.interval === 2) {
        UISelectors.intervalDecreaseBtn.disabled = false;
      }
    },
    //Display as selected the groups/individual/default chords based on the initialised set
    highlightOnLoadSelectedChords: function () {
      if (DataCtrl.getSelectionTypeFromLocalStorage() === "individualChords") {
        DataCtrl.getSelectedChordsFromLocalStorage().forEach((chord) => {
          document.getElementById(`${chord.toLowerCase().replace(" ", "").replace("/", "").replace("#", "")}`).checked = true;
          document.getElementById(`${chord.toLowerCase().replace(" ", "").replace("/", "").replace("#", "")}`).parentNode.classList.add('selected');
        });
      } else if (DataCtrl.getSelectionTypeFromLocalStorage() === "groups") {
        Object.entries(DataCtrl.getAllChords()).forEach((group) => {
          if (group[1].every(chord => AppData.loadedChords.includes(chord))) {
            document.getElementById(group[0]).checked = true;
            document.getElementById(group[0]).parentElement.classList.add('selected');
          }
        })
      } else {
        document.getElementById(AppData.defaultValues.chordGroupName).checked = true;
        document.getElementById(AppData.defaultValues.chordGroupName).parentElement.classList.add('selected');
      }
    },
    //Main screen
    displayChordsToPlay: function () {
      let random = Math.floor(Math.random() * AppData.loadedChords.length);
      if (AppData.applicationState === 1) {
        setTimeout(function () {
          if (AppData.applicationState === 0) {
            return;
          } else {
            UICtrl.flashChordToPlay();
            UICtrl.flashChordGrip();
            UISelectors.chordToPlay.innerText = AppData.loadedChords[random];
            UICtrl.displayChordGrip(AppData.loadedChords[random]);
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
    flashChordGrip: function () {
      UISelectors.finger1.style.opacity = 0;
      UISelectors.finger1bar.style.opacity = 0;
      UISelectors.finger2.style.opacity = 0;
      UISelectors.finger3.style.opacity = 0;
      UISelectors.finger4.style.opacity = 0;
      UISelectors.thumb.style.opacity = 0;
      setTimeout(function () {
        UISelectors.finger1.style.opacity = 1;
        UISelectors.finger1bar.style.opacity = 1;
        UISelectors.finger2.style.opacity = 1;
        UISelectors.finger3.style.opacity = 1;
        UISelectors.finger4.style.opacity = 1;
        UISelectors.thumb.style.opacity = 1;
      }, 200);
    },
    triggerAnimation: function (target, animationName) {
      document.querySelector(target).classList.add(`${animationName}`);
      setTimeout(() => {
        document.querySelector(target).classList.remove(`${animationName}`);
      }, 500);
    },
    visualAlarm: function (timesToFlash) {
      if (timesToFlash > 0) {
        setTimeout(function () {
          UISelectors.countdownDisplay.style.color = '#D0E1F9';
          setTimeout(function () {
            UISelectors.countdownDisplay.style.color = 'red';
            UICtrl.visualAlarm(timesToFlash - 1);
          }, 300)
        }, 300);
      } else {
        UISelectors.countdownDisplay.style.color = '#D0E1F9';
      }
    },
    displayIntervalValue: function (intervalLength) {
      UISelectors.intervalDisplayValue.textContent = `${intervalLength}s`;
      UISelectors.intervalSetupValue.textContent = `${intervalLength}s`;
    },
    displayCountdown: function () {
      UISelectors.countdownDisplayValue.innerText = `${AppData.zerosPrecedingMinutes}${AppData.displayMinutes}:${AppData.zerosPrecedingSeconds}${AppData.displaySeconds}`;
      UISelectors.countdownSetupValue.innerText = `${AppData.setupMinutes} m`;
    },
    preventMultipleBtnClick: function (clickedButtonId) {
      let target = clickedButtonId;
      target.classList.add('disabled');
      target.disabled = true;
      setTimeout(function () {
        target.classList.remove('disabled');
        target.disabled = false;
      }, 2000);
    },
    hidePlayBtn: function () {
      UISelectors.playBtn.style.display = "none";
    },
    showPlayBtn: function (prevent = "prevent") {
      if (prevent === "prevent") {
        UICtrl.preventMultipleBtnClick(UISelectors.playBtn);
      }
      UISelectors.playBtn.style.display = "block";
    },
    hidePauseBtn: function () {
      UISelectors.pauseBtn.style.display = "none";
    },
    showPauseBtn: function () {
      UICtrl.preventMultipleBtnClick(UISelectors.pauseBtn);
      UISelectors.pauseBtn.style.display = "block";
    },
    makePlayBtnInactive: function () {
      UISelectors.playBtn.classList.remove("play");
      UISelectors.playBtn.classList.add("inactive");
      UISelectors.playBtn.disabled = true;
    },
    makePlayBtnActive: function () {
      UISelectors.playBtn.classList.remove("inactive");
      UISelectors.playBtn.classList.add("play");
      UISelectors.playBtn.disabled = false;
    },
    makeRestartBtnInactive: function () {
      UISelectors.restartBtn.classList.remove("restart");
      UISelectors.restartBtn.classList.add("inactive");
      UISelectors.restartBtn.disabled = true;
    },
    makeRestartBtnActive: function () {
      UISelectors.restartBtn.classList.remove("inactive");
      UISelectors.restartBtn.classList.add("restart");
      UISelectors.restartBtn.disabled = false;
    },
    displayChordGrip: function (chordName) {
      let fingerLayout = DataCtrl.getChordGrip(chordName);
      UISelectors.finger1.style.top = `${fingerLayout["1"][0]}%`;
      UISelectors.finger1.style.left = `${fingerLayout["1"][1]}%`;
      UISelectors.finger1.style.visibility = `${fingerLayout["1"][2]}`;

      UISelectors.finger1bar.style.top = `${fingerLayout["1BAR"][0]}%`;
      UISelectors.finger1bar.style.left = `${fingerLayout["1BAR"][1]}%`;
      UISelectors.finger1bar.style.visibility = `${fingerLayout["1BAR"][2]}`;

      UISelectors.finger2.style.top = `${fingerLayout["2"][0]}%`;
      UISelectors.finger2.style.left = `${fingerLayout["2"][1]}%`;
      UISelectors.finger2.style.visibility = `${fingerLayout["2"][2]}`;

      UISelectors.finger3.style.top = `${fingerLayout["3"][0]}%`;
      UISelectors.finger3.style.left = `${fingerLayout["3"][1]}%`;
      UISelectors.finger3.style.visibility = `${fingerLayout["3"][2]}`;

      UISelectors.finger4.style.top = `${fingerLayout["4"][0]}%`;
      UISelectors.finger4.style.left = `${fingerLayout["4"][1]}%`;
      UISelectors.finger4.style.visibility = `${fingerLayout["4"][2]}`;

      UISelectors.thumb.style.top = `${fingerLayout["T"][0]}%`;
      UISelectors.thumb.style.left = `${fingerLayout["T"][1]}%`;
      UISelectors.thumb.style.visibility = `${fingerLayout["T"][2]}`;

      UISelectors.sounding1.children[0].innerText = `${fingerLayout["sounding"][0]}`;
      UISelectors.sounding2.children[0].innerText = `${fingerLayout["sounding"][1]}`;
      UISelectors.sounding3.children[0].innerText = `${fingerLayout["sounding"][2]}`;
      UISelectors.sounding4.children[0].innerText = `${fingerLayout["sounding"][3]}`;
      UISelectors.sounding5.children[0].innerText = `${fingerLayout["sounding"][4]}`;
      UISelectors.sounding6.children[0].innerText = `${fingerLayout["sounding"][5]}`;
    },
    manageChordAndGripDisplay: function () {
      //--> Display the correct chord name on the overview
      UISelectors.chordToPlay.innerText = AppData.loadedChords[0];
      //--> Display the correct chord grip on the overview
      UICtrl.displayChordGrip(AppData.loadedChords[0]);
    }

  };
})();