let words = {
  4: [
    "LOVE",
    "GAME",
    "HOME",
    "LIFE",
    "HOPE",
    "BLUE",
    "FIRE",
    "GOOD",
    "KIND",
    "TIME",
    "WORK",
    "SAFE",
    "STAR",
    "COLD",
    "DARK",
    "SOFT",
    "TRUE",
    "FREE",
    "CUTE",
    "BEST",
    "WARM",
    "SLOW",
    "FAST",
    "SONG",
    "HIGH",
    "DEEP",
    "EASY",
    "NICE",
    "PLAY",
    "TALK",
  ],
  5: [
    "APPLE",
    "BRAVE",
    "CLOUD",
    "DREAM",
    "EARTH",
    "FLAME",
    "GLORY",
    "HAPPY",
    "IVORY",
    "JOKER",
    "KNIFE",
    "LEMON",
    "MAGIC",
    "NOBLE",
    "OCEAN",
    "PENNY",
    "QUIET",
    "ROBIN",
    "SMILE",
    "TRUTH",
    "UNITY",
    "VIOLET",
    "WORLD",
    "XENON",
    "YOUTH",
    "ZEBRA",
    "WATER",
    "FAITH",
    "GRACE",
    "PEACE",
  ],
  6: [
    "PEOPLE",
    "FRIEND",
    "FAMILY",
    "ACTION",
    "FOLLOW",
    "BEAUTY",
    "HEALTH",
    "SUMMER",
    "WINTER",
    "SPRING",
    "AUTUMN",
    "NATURE",
    "PLANET",
    "SCHOOL",
    "STUDY",
    "WONDER",
    "HAPPY",
    "CANDLE",
    "MORNING",
    "THINGS",
    "SECRET",
    "SHADOW",
    "BRIGHT",
    "CHANGE",
    "YELLOW",
    "ORANGE",
    "GUITAR",
    "MOTION",
    "BUTTER",
    "GARDEN",
  ],
};

let wordLength = Math.floor(Math.random() * 3) + 4;
let randomIndexWord = Math.floor(Math.random() * words[wordLength].length);
let chosenWord = words[wordLength][randomIndexWord];
const wordCopy = chosenWord;
let triesNumber = wordLength;
let hints = Math.floor(wordLength / 2);
let currentTry = 1;


const allTries = document.querySelector(".all-tries");
const checkButton = document.querySelector("button.check");
const hintButton = document.querySelector("button.hint");
const newGameButton = document.querySelector("button.new-game");
let showedLetters = Array(wordLength).fill(null);
let currentInputs;

animation = setInterval(() => {
  hintButton.style.animationPlayState = "running";
  setTimeout(() => {
    hintButton.style.animationPlayState = "paused";
  }, 3000);
}, 30000);

function setCharAt(str, index, chr) {
  if (index > str.length - 1) return str;
  return str.substring(0, index) + chr + str.substring(index + 1);
}

function placeInputs() {
  for (let i = 1; i <= triesNumber; i++) {
    const tryDiv = document.createElement("div");
    tryDiv.classList.add(`try-${i}`);
    if (i != 1) {
      tryDiv.classList.add("disabled");
    }
    const text = document.createElement("div");
    text.classList.add("try-text");
    text.innerHTML = `Try ${i}`;
    tryDiv.appendChild(text);
    for (let j = 1; j <= wordLength; j++) {
      const input = document.createElement("input");
      input.classList.add(`try-${i}-input-${j}`);
      input.maxLength = "1";
      tryDiv.appendChild(input);
      if (i !== 1) {
        input.disabled = true;
      }
    }
    allTries.appendChild(tryDiv);
  }
  document.querySelector("button.hint span").innerHTML = hints;
}

function getCurrentInputs() {
  if (currentTry <= triesNumber) {
    currentInputs = Array.from(
      document.querySelectorAll(`.try-${currentTry} input`)
    );
    currentInputs[0].focus();
  }
}

function inputEvents() {
  Array.from(currentInputs).forEach((input, i, arr) => {
    input.addEventListener("input", () => {
      if (input.value !== " ") {
        input.value = input.value.toUpperCase();
        if (i < wordLength - 1) {
          for (let j = i + 1; j < wordLength; j++) {
            if (!arr[j].disabled) {
              arr[j].focus();
              break;
            }
          }
        }
      } else {
        input.value = "";
      }
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft" && i > 0) {
        // Goes To The Nearest Input To The Left
        for (let j = i - 1; j >= 0; j--) {
          if (!arr[j].disabled) {
            arr[j].focus();
            break;
          }
        }
      }
      if (e.key === "ArrowRight" && i < wordLength - 1) {
        // Goes To The Nearest Input To The Right
        for (let j = i + 1; j < wordLength; j++) {
          if (!arr[j].disabled) {
            arr[j].focus();
            break;
          }
        }
      }
      if (e.key === "Backspace" && i > 0) {
        input.value = "";
        // Deletes The Nearest Previous Input ==> (Not Disabled)
        for (let j = i - 1; j >= 0; j--) {
          if (!arr[j].disabled) {
            arr[j].value = "";
            arr[j].focus();
            break;
          }
        }
      }
    });
  });
}

function checkWin() {
  // Means All Letters Were Typed
  return chosenWord === "_".repeat(wordLength);
}

function showMessage(msg, win = false) {
  const message = document.querySelector(".message");
  const para = document.createElement("p");
  message.appendChild(para);
  para.innerHTML = `${msg}`;
  if (win) {
    para.classList.add("win");
  } else {
    para.classList.add("lose");
  }
}

function colorInputs() {
  currentInputs.forEach((input, i) => {
    if (!input.disabled) {
      if (input.value === chosenWord[i]) {
        showedLetters[i] = chosenWord[i];
        chosenWord = setCharAt(chosenWord, i, "_");
        input.classList.add("in-place-color");
      } else if (chosenWord.includes(input.value) && input.value !== "") {
        input.classList.add("not-in-place-color");
      } else {
        input.classList.add("wrong-color");
      }
    }
  });
}

function disableInputs() {
  document.querySelector(`.try-${currentTry}`).classList.add("disabled");
  currentInputs.forEach((input) => {
    input.disabled = true;
  });
}

function enableInputs() {
  document.querySelector(`.try-${currentTry}`).classList.remove("disabled");
  currentInputs.forEach((input, i) => {
    input.disabled = false;
    if (showedLetters[i]) {
      input.value = showedLetters[i];
      input.classList.add("in-place-color");
      input.disabled = true;
    }
  });
  if (currentTry <= triesNumber) {
    currentInputs[showedLetters.indexOf(null)].focus();
  }
}

function disableButtons() {
  checkButton.disabled = true;
  hintButton.disabled = true;
  clearInterval(animation);
}

function getHint() {
  let availableInputs = currentInputs.filter((input) => input.value === "");

  if (availableInputs.length !== 0) {
    hints--;

    document.querySelector("button.hint span").innerHTML = hints;

    randomIndex = Math.floor(Math.random() * availableInputs.length);

    input = availableInputs[randomIndex];

    indexOfLetter = currentInputs.indexOf(input);

    input.value = chosenWord[indexOfLetter];

    showedLetters[indexOfLetter] = chosenWord[indexOfLetter];

    chosenWord = setCharAt(chosenWord, indexOfLetter, "_");

    input.classList.add("in-place-color");

    input.disabled = true;
  }
  if (hints == 0) {
    hintButton.disabled = true;
    hintButton.style.animation = "none";
    clearInterval(animation);
  }
}

checkButton.addEventListener("click", () => {
  colorInputs();
  disableInputs();
  if (checkWin()) {
    showMessage(`Congratulations!!!<br>YOU WIN!`, true);
    disableButtons();
    document.querySelector(`.try-${currentTry}`).classList.remove("disabled");
  } else if (currentTry === triesNumber) {
    showMessage(`YOU LOSE!<br>The Word Was '${wordCopy}'.`);
    disableButtons();
  } else {
    currentTry++;
    getCurrentInputs();
    enableInputs();
    inputEvents();
  }
});

newGameButton.addEventListener("click", () => {
  window.location.reload();
});

hintButton.addEventListener("click", () => {
  if (hints > 0) {
    getHint();
    if (showedLetters.includes(null)) {
      currentInputs[showedLetters.indexOf(null)].focus();
    }
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    if (!checkButton.disabled) {
      checkButton.click();
    } else {
      newGameButton.click();
    }
  }
});

window.onload = function () {
  placeInputs();
  getCurrentInputs();
  inputEvents();
};
