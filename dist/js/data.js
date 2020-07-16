//Data controller
const DataCtrl = (function () {
  const appData = {
    correctTotal: null,
    remainingTotal: null,
    wrongTotal: null,
    loadedChords: null,
    currentChord: null,
    selectedAnswer: null,
    appState: null,
    minChordsForTraining: 3,
    maxChordsForTraining: 10,
    currentlyNumberChordsForTraining: 0,
  };

  const allChords = {
    "A": "A.mp3",
    "C": "C.mp3",
    "D": "D.mp3",
    "E": "E.mp3",
    "G": "G.mp3",
    "Amin": "Amin.mp3",
    "Emin": "Emin.mp3",
    "Dmin": "Dmin.mp3",
    "A7": "A7.mp3",
    "D7": "D7.mp3",
    "E7": "E7.mp3",
    "G7": "G7.mp3",
    "C7": "C7.mp3",
    "B7": "B7.mp3",
    "Asus4": "Asus4.mp3",
    "Asus2": "Asus2.mp3",
    "Dsus4": "Dsus4.mp3",
    "Dsus2": "Dsus2.mp3",
    "Esus4": "Esus4.mp3",
    "F": "F.mp3",
    "FMaj7": "FMaj7.mp3",
    "D/F#": "D-F.mp3",
    "G/B": "G-B.mp3",
    "C/G": "C-G.mp3",
    "Big G": "BigG.mp3",
    "Rock G": "RockG.mp3",
    "Folk G": "FolkG.mp3",
  };

  const soundSelectors = {
    currentChord: document.getElementById('currentChord'),
    chordOnDemand: document.getElementById('chordOnDemand'),
  }

  return {
    getAppData: function () {
      return appData;
    },
    setDefaultAppData: function () {
      appData.correctTotal = 0;
      appData.remainingTotal = 3;
      appData.wrongTotal = 0;
      appData.loadedChords = ["A", "C", "D", "E", "G"];
      appData.currentChord = appData.loadedChords[Math.floor(Math.random() * appData.loadedChords.length)];
      appData.appState = "readyToStart";
    },
    getAllChordNames: function () {
      return Array.from(Object.keys(allChords));
    },
    getChordSoundFileName: function (chordName) {
      return allChords[chordName];
    },
    getSoundSelectors: function () {
      return soundSelectors;
    },
    getNextChord: function () {
      appData.currentChord = appData.loadedChords[Math.floor(Math.random() * appData.loadedChords.length)];
    }

  }
})();