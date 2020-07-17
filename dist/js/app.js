//App controller
const App = (function (DataCtrl, UICtrl) {
  const loadEventListeners = function () {
    //Use the public method of UICtrl to get available UI selectors for further re-use in the APP controller here
    const UISelectors = UICtrl.getSelectors();


    //Execute the primary action
    UISelectors.primaryActionBtn.addEventListener('click', executePrimaryAction);

    //Save answer and play a chord on demand
    document.getElementById('chord-options').addEventListener('click', (e) => {
      if (e.target.disabled != true) {
        //Request saving the answer
        saveAnswer(e.target.value);
        //Request playing the chord
        playChordOnDemand(e.target.value);
        //Hihglight the selected answer
        UICtrl.highlightSelectedAnswer(e.target.parentNode);
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
    });

    //Evaluate (Confirm) the answer
    UISelectors.confirmBtn.addEventListener('click', evaluateAnswer);

    //Restart the training
    UISelectors.restartBtn.addEventListener('click', restartTraining);

    //Show settings
    UISelectors.showSettingsBtn.addEventListener('click', UICtrl.showSettings);

    //Hide settings
    UISelectors.hideSettingsBtn.addEventListener('click', UICtrl.hideSettings);

    //Hihglighting chords + trigger "save settings" validation when selecting chords in settings
    document.getElementById('individual-chords').addEventListener('click', (e) => {
      if (DataCtrl.getAppData().currentlyNumberChordsForTraining < DataCtrl.getAppData().maxChordsForTraining) {
        if (e.target.checked === true) {
          DataCtrl.getAppData().currentlyNumberChordsForTraining += 1;
          validateChordSettings();
          e.target.parentNode.classList.add("selected");
          console.log(DataCtrl.getAppData().currentlyNumberChordsForTraining);
        } else if (e.target.checked === false) {
          DataCtrl.getAppData().currentlyNumberChordsForTraining -= 1;
          validateChordSettings();
          e.target.parentNode.classList.remove("selected");
          console.log(DataCtrl.getAppData().currentlyNumberChordsForTraining);
        }
      }
      if (DataCtrl.getAppData().currentlyNumberChordsForTraining === DataCtrl.getAppData().maxChordsForTraining) {
        console.log('max num of chords reached');
        Array.from(document.getElementsByClassName('individual-chord')).forEach((item) => {
          if (item.children[0].checked === false) {
            item.children[0].disabled = true;
          }
        });
        if (e.target.checked === false) {
          DataCtrl.getAppData().currentlyNumberChordsForTraining -= 1;
          e.target.parentNode.classList.remove("selected");
          console.log(DataCtrl.getAppData().currentlyNumberChordsForTraining);
          Array.from(document.getElementsByClassName('individual-chord')).forEach((item) => {
            item.children[0].disabled = false;
          });
        }
      }
    });

    //Save chords selected in settings
    UISelectors.hideSettingsBtn.addEventListener('click', (e) => {
      saveChordSetup();
      restartTraining();
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
          UICtrl.makeRestartBtnActive();
          UICtrl.triggerAnimation(".primary-action-button", 'rotate');
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
        UICtrl.setMainBtnState();
        break;
      case "finished-standard":
        UICtrl.setMainBtnState();
        break;
    }
  }



  //Play the current chord
  const playCurrentChord = function (e) {
    DataCtrl.getSoundSelectors().currentChord.src = `/dist/sounds/chords/${DataCtrl.getChordSoundFileName(DataCtrl.getAppData().currentChord)}`;
    DataCtrl.getSoundSelectors().currentChord.play();
    executePrimaryAction();
    //e.preventDefault();
  };

  //Play a chord on demand
  const playChordOnDemand = function (chordName) {
    DataCtrl.getSoundSelectors().chordOnDemand.src = `/dist/sounds/chords/${DataCtrl.getChordSoundFileName(chordName)}`;
    DataCtrl.getSoundSelectors().chordOnDemand.play();
  };

  //Save an answer
  const saveAnswer = function (answer) {
    DataCtrl.getAppData().selectedAnswer = answer;
  };

  //Evaluate the answer
  const evaluateAnswer = function () {
    //If answer correct: 
    if (DataCtrl.getAppData().selectedAnswer === DataCtrl.getAppData().currentChord) {
      DataCtrl.getAppData().correctTotal += 1;
      UICtrl.updateCorrectDisplayTotal();
      UICtrl.triggerAnimation("#correct-display", 'anim-pop-in-out');
      DataCtrl.getAppData().remainingTotal -= 1;
      UICtrl.updateRemainingDisplayTotal();
      UICtrl.makeAnswerOptionsInactive();
      UICtrl.makeConfirmBtnInactive();
      UICtrl.highlightCorrectAnswer();
      decideNextStep();
      //If answer incorrect: 
    } else {
      DataCtrl.getAppData().wrongTotal += 1;
      UICtrl.updateWrongDisplayTotal();
      UICtrl.triggerAnimation("#wrong-display", 'anim-pop-in-out');
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
      if (DataCtrl.getAppData().correctTotal >= 2) {
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
    DataCtrl.getAppData().remainingTotal = 3;
    DataCtrl.getAppData().wrongTotal = 0;
    DataCtrl.getAppData().currentChord = DataCtrl.getAppData().loadedChords[Math.floor(Math.random() * DataCtrl.getAppData().loadedChords.length)];
    DataCtrl.getAppData().selectedAnswer = null;
    DataCtrl.getAppData().appState = "readyToStart";
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
    document.getElementsByName('individualChord').forEach((chord) => {
      if (chord.checked) {
        DataCtrl.getAppData().loadedChords.push(chord.value);
      }
    })
  };

  //Settings - min/max chords validation
  const validateChordSettings = function () {
    let appData = DataCtrl.getAppData();
    if (appData.currentlyNumberChordsForTraining >= appData.minChordsForTraining && appData.currentlyNumberChordsForTraining <= appData.maxChordsForTraining) {
      UICtrl.getSelectors().hideSettingsBtn.classList.add('enabled');
      UICtrl.getSelectors().hideSettingsBtn.classList.remove('disabled');
      UICtrl.getSelectors().hideSettingsBtn.disabled = false;
    } else {
      UICtrl.getSelectors().hideSettingsBtn.classList.remove('enabled');
      UICtrl.getSelectors().hideSettingsBtn.classList.add('disabled');
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
      UICtrl.hideSettings();
      loadEventListeners();
    },
    restart: function () {
      restartTraining();
    }
  }
})(DataCtrl, UICtrl);

//Initialize the app
App.init();