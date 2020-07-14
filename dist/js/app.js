//App controller
const App = (function (DataCtrl, UICtrl) {
  const loadEventListeners = function () {
    //Use the public method of UICtrl to get available UI selectors for further re-use in the APP controller here
    const UISelectors = UICtrl.getSelectors();


    //Execute the primary action
    UISelectors.primaryActionBtn.addEventListener('click', executePrimaryAction);

    //Save answer and play a chord on demand
    document.getElementById('chord-options').addEventListener('click', (e) => {
      if (e.target.classList.contains("chord-option-label") && e.target.parentNode.children[0].disabled != true) {
        //Request saving the answer
        saveAnswer(e.target.parentNode.children[0].value);
        //Request playing the chord
        playChordOnDemand(e.target.parentNode.children[0].value);
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
        }, 4000);
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

    //Hihglighting chords when selecting them in settings
    document.getElementById('individual-chords').addEventListener('click', (e) => {
      UICtrl.highlightChordSetup(e);
    });

    //Save chords selected in settings
    UISelectors.hideSettingsBtn.addEventListener('click', saveChordSetup);
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
          UICtrl.makeAnswerOptionsActive();
        }, 4000);
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
    UICtrl.updateWrongDisplayTotal();
    UICtrl.updateRemainingDisplayTotal();
    UICtrl.updateCorrectDisplayTotal();
    DataCtrl.getAppData().selectedAnswer = null;
    UICtrl.clearAnswer();
    UICtrl.unHighlightCorrectAnswer();
    UICtrl.unHighlightSelectedAnswer();
    UICtrl.makeAnswerOptionsInactive();
    UICtrl.makeRestartBtnInactive();
    UICtrl.makeConfirmBtnInactive();
    DataCtrl.getAppData().appState = "readyToStart";
    UICtrl.setMainBtnState();
  };

  const saveChordSetup = function () {
    DataCtrl.getAppData().loadedChords = [];
    document.getElementsByName('individualChord').forEach((chord) => {
      if (chord.checked) {
        DataCtrl.getAppData().loadedChords.push(chord.value);
      }
    })
  };


  //Public methods
  return {
    init: function () {
      DataCtrl.setDefaultAppData();
      UICtrl.updateWrongDisplayTotal();
      UICtrl.updateRemainingDisplayTotal();
      UICtrl.updateCorrectDisplayTotal();
      UICtrl.setMainBtnState();
      UICtrl.makeConfirmBtnInactive();
      UICtrl.makeRestartBtnInactive();
      UICtrl.makeAnswerOptionsInactive();
      loadEventListeners();
    }
  }
})(DataCtrl, UICtrl);

//Initialize the app
App.init();