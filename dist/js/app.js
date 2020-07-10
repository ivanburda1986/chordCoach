//App controller
const App = (function (DataCtrl, UICtrl) {
  const loadEventListeners = function () {
    //Use the public method of UICtrl to get available UI selectors for further re-use in the APP controller here
    const UISelectors = UICtrl.getSelectors();


    //Play the current chord
    UISelectors.chordToRecognizeBtn.addEventListener('click', playCurrentChord);

    //Play a chord on demand
    document.getElementById('chord-options').addEventListener('click', (e) => {
      if (e.target.classList.contains("chord-option-label")) {
        playChordOnDemand(e.target.parentNode.children[0].id)
      }
    });
  };

  //Play the current chord
  const playCurrentChord = function (e) {
    DataCtrl.getSoundSelectors().currentChord.src = `/dist/sounds/chords/${DataCtrl.getChordSoundFileName(DataCtrl.getAppData().currentChord)}`;
    DataCtrl.getSoundSelectors().currentChord.play();
    e.preventDefault();
  }

  //Play a chord on demand
  const playChordOnDemand = function (chordId) {
    DataCtrl.getSoundSelectors().chordOnDemand.src = `/dist/sounds/chords/${DataCtrl.getChordSoundFileName(chordId)}`;
    DataCtrl.getSoundSelectors().chordOnDemand.play();
    console.log(chordId);
  }


  //Public methods
  return {
    init: function () {
      DataCtrl.setDefaultAppData();
      UICtrl.updateWrongDisplayTotal(DataCtrl.getAppData().wrongTotal);
      UICtrl.updateRemainingDisplayTotal(DataCtrl.getAppData().remainingTotal);
      UICtrl.updateCorrectDisplayTotal(DataCtrl.getAppData().correctTotal);
      loadEventListeners();
    }
  }
})(DataCtrl, UICtrl);

//Initialize the app
App.init();