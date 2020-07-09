//App controller
const App = (function (DataCtrl, UICtrl) {

  //Public methods
  return {
    init: function () {
      DataCtrl.setDefaultAppData();
      UICtrl.updateWrongDisplayTotal(DataCtrl.getAppData().wrongTotal);
      UICtrl.updateRemainingDisplayTotal(DataCtrl.getAppData().remainingTotal);
      UICtrl.updateCorrectDisplayTotal(DataCtrl.getAppData().correctTotal);
    },
    playCurrentChord: function () {

    }
  }
})(DataCtrl, UICtrl);

//Initialize the app
App.init();