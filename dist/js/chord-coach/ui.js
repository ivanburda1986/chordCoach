//UI Controller
const UICtrl = (function () {
  //UI Selectors
  const UISelectors = {
    //Main screen
    mainScreen: document.querySelector(".app-container"),

    //Switch to Chord coach
    chordSpottingSwitchBtn: document.getElementById("chord-spotting-btn"),

    //Feedback
    feedbackOverlay: document.getElementById("feedback-overlay"),
    hideFeedback: document.getElementById("feedback-hide-btn"),
    showFeedback: document.getElementById("show-feedback-btn"),
    feedbackTextInput: document.getElementById("feedback-textarea"),
    submitFeedback: document.getElementById("submit-btn"),
  };

  //Public methods
  return {
    getSelectors: function () {
      return UISelectors;
    },
    showFeedback: function () {
      UISelectors.feedbackOverlay.classList.add("show");
      UISelectors.feedbackOverlay.classList.remove("hide");
      UISelectors.mainScreen.classList.add("hide");
    },
    hideFeedback: function () {
      UISelectors.feedbackOverlay.classList.add("hide");
      UISelectors.feedbackOverlay.classList.remove("show");
      UISelectors.mainScreen.classList.remove("hide");
    },
  };
})();
