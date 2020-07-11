//App controller
const App = (function (DataCtrl, UICtrl) {
  const loadEventListeners = function () {
    //Use the public method of UICtrl to get available UI selectors for further re-use in the APP controller here
    const UISelectors = UICtrl.getSelectors();


    //Execute the primary action
    UISelectors.primaryActionBtn.addEventListener('click', executePrimaryAction);

    //Save answer and play a chord on demand
    document.getElementById('chord-options').addEventListener('click', (e) => {
      if (e.target.classList.contains("chord-option-label")) {
        saveAnswer(e.target.parentNode.children[0].id);
        UICtrl.highlightSelectedAnswer(e.target.parentNode);
        playChordOnDemand(e.target.parentNode.children[0].id);
      }
    });

    //Evaluate the answer
    UISelectors.confirmBtn.addEventListener('click', evaluateAnswer);

    //Restart the training
    UISelectors.restartBtn.addEventListener('click', restartTraining);
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
        playCurrentChord();
        break;
      case "playing":
        setTimeout(function () {
          DataCtrl.getAppData().appState = "repeat";
          UICtrl.setMainBtnState();
        }, 4000);
        break;
      case "repeat":
        DataCtrl.getAppData().appState = "playing";
        UICtrl.setMainBtnState();
        playCurrentChord();
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
  const playChordOnDemand = function (chordId) {
    DataCtrl.getSoundSelectors().chordOnDemand.src = `/dist/sounds/chords/${DataCtrl.getChordSoundFileName(chordId)}`;
    DataCtrl.getSoundSelectors().chordOnDemand.play();
  };

  //Save an answer
  const saveAnswer = function (answer) {
    DataCtrl.getAppData().selectedAnswer = answer;
  };

  //Evaluate the answer
  const evaluateAnswer = function () {
    if (DataCtrl.getAppData().selectedAnswer === DataCtrl.getAppData().currentChord) {
      //If answer correct: 
      DataCtrl.getAppData().correctTotal += 1;
      UICtrl.updateCorrectDisplayTotal();
      DataCtrl.getAppData().remainingTotal -= 1;
      UICtrl.updateRemainingDisplayTotal();
      UICtrl.highlightSelectedAnswer();
      decideNextStep();
    } else {
      //If answer incorrect: 
      DataCtrl.getAppData().wrongTotal += 1;
      UICtrl.updateWrongDisplayTotal();
      DataCtrl.getAppData().remainingTotal -= 1;
      UICtrl.updateRemainingDisplayTotal();
      UICtrl.highlightSelectedAnswer();
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
  const restartTraining = function () {
    DataCtrl.getAppData().correctTotal = 0;
    DataCtrl.getAppData().remainingTotal = 3;
    DataCtrl.getAppData().wrongTotal = 0;
    UICtrl.updateWrongDisplayTotal();
    UICtrl.updateRemainingDisplayTotal();
    UICtrl.updateCorrectDisplayTotal();
    DataCtrl.getAppData().selectedAnswer = null;
    UICtrl.clearAnswer();
    UICtrl.highlightSelectedAnswer();
    DataCtrl.getAppData().appState = "readyToStart";
    UICtrl.setMainBtnState();
  }

  //Public methods
  return {
    init: function () {
      DataCtrl.setDefaultAppData();
      UICtrl.updateWrongDisplayTotal();
      UICtrl.updateRemainingDisplayTotal();
      UICtrl.updateCorrectDisplayTotal();
      UICtrl.setMainBtnState();
      loadEventListeners();
    }
  }
})(DataCtrl, UICtrl);

//Initialize the app
App.init();