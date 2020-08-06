//App controller
const App = (function (DataCtrl, UICtrl) {
  const loadEventListeners = function () {
    //Use the public method of UICtrl to get available UI selectors for further re-use in the APP controller here
    const UISelectors = UICtrl.getSelectors();

    //Switch to Chord coach
    UISelectors.chordCoachSwitchBtn.addEventListener("click", () => {
      window.open("chord-coach.html", "_self");
    });

    //Execute the primary action
    UISelectors.primaryActionBtn.addEventListener(
      "click",
      executePrimaryAction
    );

    //Save answer and play a chord on demand
    document.getElementById("chord-options").addEventListener("click", (e) => {
      if (e.target.disabled != true) {
        //Request saving the answer
        saveAnswer(e.target.value);
        //Hihglight the selected answer
        UICtrl.highlightSelectedAnswer(e.target.parentNode);

        if (DataCtrl.getAppData().hardcore === "off") {
          //Request playing the chord
          playChordOnDemand(e.target.value);
          //Request management of the UI elements
          UICtrl.makeAnswerOptionsInactive();
          UICtrl.makeConfirmBtnInactive();
          UICtrl.makeRestartBtnInactive();
          UICtrl.makeMainBtnInactive();
          setTimeout(function () {
            UICtrl.makeAnswerOptionsActive();
            UICtrl.makeConfirmBtnActive();
            UICtrl.makeRestartBtnActive();
            UICtrl.makeMainBtnActive();
          }, 2000);
        }
      }
    });

    //Evaluate (Confirm) the answer
    UISelectors.confirmBtn.addEventListener("click", evaluateAnswer);

    //Restart the training
    UISelectors.restartBtn.addEventListener("click", restartTraining);

    //Show settings
    UISelectors.showSettingsBtn.addEventListener("click", UICtrl.showSettings);

    //Hide settings
    UISelectors.hideSettingsBtn.addEventListener("click", UICtrl.hideSettings);

    //Hihglighting chords + trigger "save settings" validation when selecting chords in settings
    document
      .getElementById("individual-chords")
      .addEventListener("click", (e) => {
        if (
          DataCtrl.getAppData().currentlyNumberChordsForTraining <
          DataCtrl.getAppData().maxChordsForTraining
        ) {
          if (e.target.checked === true) {
            DataCtrl.getAppData().currentlyNumberChordsForTraining += 1;
            validateChordSettings();
            e.target.parentNode.classList.add("selected");
          } else if (e.target.checked === false) {
            DataCtrl.getAppData().currentlyNumberChordsForTraining -= 1;
            validateChordSettings();
            e.target.parentNode.classList.remove("selected");
          }
        }
        if (
          DataCtrl.getAppData().currentlyNumberChordsForTraining ===
          DataCtrl.getAppData().maxChordsForTraining
        ) {
          Array.from(
            document.getElementsByClassName("individual-chord")
          ).forEach((item) => {
            if (item.children[0].checked === false) {
              item.children[0].disabled = true;
              item.classList.add("inactive");
            }
          });
          if (e.target.checked === false) {
            DataCtrl.getAppData().currentlyNumberChordsForTraining -= 1;
            e.target.parentNode.classList.remove("selected");
            Array.from(
              document.getElementsByClassName("individual-chord")
            ).forEach((item) => {
              item.children[0].disabled = false;
              item.classList.remove("inactive");
            });
          }
        }
      });

    //Save chords selected in settings
    UISelectors.hideSettingsBtn.addEventListener("click", (e) => {
      saveChordSetup();
      DataCtrl.saveSettingsToLocalStorage();
      restartTraining();
    });

    //Turn on/off the hardcore mode
    UISelectors.hardcoreBtn.addEventListener("click", (e) => {
      if (e.target.checked === true) {
        e.target.parentNode.classList.add("hardcore-on");
        DataCtrl.getAppData().hardcore = "on";
        DataCtrl.getSoundSelectors().hardcoreOn.src = `sounds/hardcore-on.mp3`;
        DataCtrl.getSoundSelectors().hardcoreOn.play();
      } else if (e.target.checked === false) {
        e.target.parentNode.classList.remove("hardcore-on");
        DataCtrl.getAppData().hardcore = "off";
        DataCtrl.getSoundSelectors().hardcoreOff.src = `sounds/hardcore-off.mp3`;
        DataCtrl.getSoundSelectors().hardcoreOff.play();
      }
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
  };

  //Execute the primary action
  const executePrimaryAction = function () {
    switch (DataCtrl.getAppData().appState) {
      case "readyToStart":
        DataCtrl.getAppData().appState = "playing";
        UICtrl.setMainBtnState();
        playCurrentChord();
        break;
      case "playNext":
        DataCtrl.getAppData().appState = "playing";
        UICtrl.setMainBtnState();
        UICtrl.unHighlightCorrectAnswer();
        UICtrl.unHighlightSelectedAnswer();
        UICtrl.makeAnswerOptionsInactive();
        playCurrentChord();
        break;
      case "playing":
        setTimeout(function () {
          DataCtrl.getAppData().appState = "repeat";
          UICtrl.setMainBtnState();
          UICtrl.makeConfirmBtnActive();
          UICtrl.makeRestartBtnActive();
          UICtrl.makeAnswerOptionsActive();
        }, 2000);
        break;
      case "repeat":
        DataCtrl.getAppData().appState = "playing";
        UICtrl.setMainBtnState();
        playCurrentChord();
        UICtrl.makeConfirmBtnInactive();
        UICtrl.makeRestartBtnInactive();
        UICtrl.makeAnswerOptionsInactive();
        break;
      case "finished-victory":
        setTimeout(function () {
          DataCtrl.getSoundSelectors().evaluation.src = `sounds/victory.mp3`;
          DataCtrl.getSoundSelectors().evaluation.play();
        }, 1100);
        UICtrl.setMainBtnState();
        break;
      case "finished-standard":
        setTimeout(function () {
          DataCtrl.getSoundSelectors().evaluation.src = `sounds/lost.mp3`;
          DataCtrl.getSoundSelectors().evaluation.play();
        }, 1100);
        UICtrl.setMainBtnState();
        break;
    }
  };

  //Play the current chord
  const playCurrentChord = function (e) {
    DataCtrl.getSoundSelectors().currentChord.src = `sounds/chords/${DataCtrl.getChordSoundFileName(
      DataCtrl.getAppData().currentChord
    )}`;
    DataCtrl.getSoundSelectors().currentChord.play();
    UICtrl.triggerAnimation(".primary-action-button", "playing");
    executePrimaryAction();
    //e.preventDefault();
  };

  //Play a chord on demand
  const playChordOnDemand = function (chordName) {
    DataCtrl.getSoundSelectors().chordOnDemand.src = `sounds/chords/${DataCtrl.getChordSoundFileName(
      chordName
    )}`;
    DataCtrl.getSoundSelectors().chordOnDemand.play();
  };

  //Save an answer
  const saveAnswer = function (answer) {
    DataCtrl.getAppData().selectedAnswer = answer;
  };

  //Evaluate the answer
  const evaluateAnswer = function () {
    //If answer correct:
    if (
      DataCtrl.getAppData().selectedAnswer ===
      DataCtrl.getAppData().currentChord
    ) {
      DataCtrl.getAppData().correctTotal += 1;
      DataCtrl.getSoundSelectors().evaluation.src = `sounds/correct.mp3`;
      DataCtrl.getSoundSelectors().evaluation.play();
      UICtrl.updateCorrectDisplayTotal();
      UICtrl.triggerAnimation("#correct-display", "anim-pop-in-out");
      DataCtrl.getAppData().remainingTotal -= 1;
      UICtrl.updateRemainingDisplayTotal();
      UICtrl.makeAnswerOptionsInactive();
      UICtrl.makeConfirmBtnInactive();
      UICtrl.highlightCorrectAnswer();
      decideNextStep();
      //If answer incorrect:
    } else {
      DataCtrl.getAppData().wrongTotal += 1;
      DataCtrl.getSoundSelectors().evaluation.src = `sounds/wrong.mp3`;
      DataCtrl.getSoundSelectors().evaluation.play();
      UICtrl.updateWrongDisplayTotal();
      UICtrl.triggerAnimation("#wrong-display", "anim-pop-in-out");
      DataCtrl.getAppData().remainingTotal -= 1;
      UICtrl.updateRemainingDisplayTotal();
      UICtrl.makeAnswerOptionsInactive();
      UICtrl.makeConfirmBtnInactive();
      UICtrl.highlightCorrectAnswer();
      decideNextStep();
    }
  };

  //Continue to the next chord
  const nextChord = function () {
    DataCtrl.getAppData().selectedAnswer = null;
    UICtrl.clearAnswer();
    DataCtrl.getNextChord();
  };

  //Evaluate whether this was the last chord in the training or not and trigger an appropriate following action
  const decideNextStep = function () {
    if (DataCtrl.getAppData().remainingTotal === 0) {
      if (DataCtrl.getAppData().correctTotal >= 7) {
        DataCtrl.getAppData().appState = "finished-victory";
        executePrimaryAction();
      } else {
        DataCtrl.getAppData().appState = "finished-standard";
        executePrimaryAction();
      }
    } else {
      nextChord();
      DataCtrl.getAppData().appState = "playNext";
      UICtrl.setMainBtnState();
    }
  };

  //Restart the training
  const restartTraining = function () {
    DataCtrl.getAppData().correctTotal = 0;
    DataCtrl.getAppData().remainingTotal = DataCtrl.getAppData().defaultTotal;
    DataCtrl.getAppData().wrongTotal = 0;
    DataCtrl.getAppData().currentChord = DataCtrl.getAppData().loadedChords[
      Math.floor(Math.random() * DataCtrl.getAppData().loadedChords.length)
    ];
    DataCtrl.getAppData().selectedAnswer = null;
    DataCtrl.getSoundSelectors().restart.src = `sounds/start.mp3`;
    DataCtrl.getSoundSelectors().restart.play();
    DataCtrl.getAppData().appState = "readyToStart";
    UICtrl.triggerAnimation("#remaining-display", "anim-pop-in-out");
    UICtrl.updateWrongDisplayTotal();
    UICtrl.updateRemainingDisplayTotal();
    UICtrl.updateCorrectDisplayTotal();
    UICtrl.displayAnswerSet();
    UICtrl.clearAnswer();
    UICtrl.unHighlightCorrectAnswer();
    UICtrl.unHighlightSelectedAnswer();
    UICtrl.makeAnswerOptionsInactive();
    UICtrl.makeRestartBtnInactive();
    UICtrl.makeConfirmBtnInactive();
    UICtrl.setMainBtnState();
  };

  //Save chord setup
  const saveChordSetup = function () {
    DataCtrl.getAppData().loadedChords = [];
    document.getElementsByName("individualChord").forEach((chord) => {
      if (chord.checked) {
        DataCtrl.getAppData().loadedChords.push(chord.value);
      }
    });
  };

  //Settings - min/max chords validation
  const validateChordSettings = function () {
    let appData = DataCtrl.getAppData();
    if (
      appData.currentlyNumberChordsForTraining >=
      appData.minChordsForTraining &&
      appData.currentlyNumberChordsForTraining <= appData.maxChordsForTraining
    ) {
      UICtrl.getSelectors().hideSettingsBtn.classList.add("enabled");
      UICtrl.getSelectors().hideSettingsBtn.classList.remove("disabled");
      UICtrl.getSelectors().hideSettingsBtn.disabled = false;
    } else {
      UICtrl.getSelectors().hideSettingsBtn.classList.remove("enabled");
      UICtrl.getSelectors().hideSettingsBtn.classList.add("disabled");
      UICtrl.getSelectors().hideSettingsBtn.disabled = true;
    }
  };

  //Public methods
  return {
    init: function () {
      DataCtrl.setDefaultAppData();
      UICtrl.displayAnswerSet();
      UICtrl.updateWrongDisplayTotal();
      UICtrl.updateRemainingDisplayTotal();
      UICtrl.updateCorrectDisplayTotal();
      UICtrl.setMainBtnState();
      UICtrl.makeConfirmBtnInactive();
      UICtrl.makeRestartBtnInactive();
      UICtrl.makeAnswerOptionsInactive();
      UICtrl.highlightSettingsSelection();
      UICtrl.highlightDifficulty();
      validateChordSettings();
      UICtrl.displaySettingsHeadline();
      UICtrl.hideSettings();
      loadEventListeners();
    },
    restart: function () {
      restartTraining();
    },
  };
})(DataCtrl, UICtrl);

//Initialize the app
App.init();