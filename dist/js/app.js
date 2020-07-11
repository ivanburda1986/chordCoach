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
        playChordOnDemand(e.target.parentNode.children[0].id);
      }
    });

    //Evaluate the answer
    UISelectors.confirmBtn.addEventListener('click', evaluateAnswer);
  };

  //Execute the primary action
  const executePrimaryAction = function () {
    switch (DataCtrl.getAppData().appState) {
      case "readyToStart":
        UICtrl.setMainBtnState('playing');
        DataCtrl.getAppData().appState = "playing";
        playCurrentChord();
        break;
      case "playing":
        setTimeout(function () {
          UICtrl.setMainBtnState('repeat');
          DataCtrl.getAppData().appState = "repeat";
        }, 4000);
        break;
      case "repeat":
        UICtrl.setMainBtnState('playing');
        DataCtrl.getAppData().appState = "playing";
        playCurrentChord();
        break;
        // case "finished-victory":
        //   break;
        // case "finished-standard":
        //   break;
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
      decideNextStep();
    } else {
      //If answer incorrect: 
      DataCtrl.getAppData().wrongTotal += 1;
      UICtrl.updateWrongDisplayTotal();
      decideNextStep();
    }
  };

  //Continue to the next chord
  const nextChord = function () {
    DataCtrl.getAppData().remainingTotal -= 1;
    UICtrl.updateRemainingDisplayTotal();
    DataCtrl.getAppData().selectedAnswer = null;
    UICtrl.clearAnswer();
    DataCtrl.getNextChord();
    UICtrl.setMainBtnState('readyToStart');
    DataCtrl.getAppData().appState = "readyToStart";
  };

  //Evaluate whether this was the last chord in the training or not and trigger an appropriate following action
  const decideNextStep = function () {
    if (DataCtrl.getAppData().remainingTotal === 0) {
      if (DataCtrl.getAppData().correctTotal >= 7) {
        UICtrl.setMainBtnState("finished-victory");
        DataCtrl.getAppData().appState = "finished-victory";
      } else {
        UICtrl.setMainBtnState("finished-standard");
        DataCtrl.getAppData().appState = "finished-standard";
      }
    } else {
      nextChord();
    }

  }

  //Public methods
  return {
    init: function () {
      DataCtrl.setDefaultAppData();
      UICtrl.updateWrongDisplayTotal();
      UICtrl.updateRemainingDisplayTotal();
      UICtrl.updateCorrectDisplayTotal();
      UICtrl.setMainBtnState('readyToStart');
      loadEventListeners();
    }
  }
})(DataCtrl, UICtrl);

//Initialize the app
App.init();