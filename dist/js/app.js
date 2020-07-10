//App controller
const App = (function (DataCtrl, UICtrl) {
  const loadEventListeners = function () {
    //Use the public method of UICtrl to get available UI selectors for further re-use in the APP controller here
    const UISelectors = UICtrl.getSelectors();


    //Play the current chord
    UISelectors.chordToRecognizeBtn.addEventListener('click', playCurrentChord);

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

  //Play the current chord
  const playCurrentChord = function (e) {
    DataCtrl.getSoundSelectors().currentChord.src = `/dist/sounds/chords/${DataCtrl.getChordSoundFileName(DataCtrl.getAppData().currentChord)}`;
    DataCtrl.getSoundSelectors().currentChord.play();
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
      nextChord();
    } else {
      //If answer incorrect: 
      DataCtrl.getAppData().wrongTotal += 1;
      UICtrl.updateWrongDisplayTotal();
      nextChord();
    }
  };

  //Continue to the next chord
  const nextChord = function () {
    DataCtrl.getAppData().remainingTotal -= 1;
    UICtrl.updateRemainingDisplayTotal();
    DataCtrl.getAppData().selectedAnswer = null;
    UICtrl.clearAnswer();
    DataCtrl.getNextChord();
  };

  //Public methods
  return {
    init: function () {
      DataCtrl.setDefaultAppData();
      UICtrl.updateWrongDisplayTotal();
      UICtrl.updateRemainingDisplayTotal();
      UICtrl.updateCorrectDisplayTotal();
      loadEventListeners();
    }
  }
})(DataCtrl, UICtrl);

//Initialize the app
App.init();