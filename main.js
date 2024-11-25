let words = {
  4: [
    "TREE",
    "MOON",
    "STAR",
    "LAMP",
    "FISH",
    "WIND",
    "FIRE",
    "BOOK",
    "SHIP",
    "CAVE",
  ],
  5: [
    "TABLE",
    "CHAIR",
    "PLANT",
    "PIZZA",
    "SMILE",
    "BEACH",
    "TRAIN",
    "CLOUD",
    "EARTH",
    "DREAM",
  ],
  6: [
    "GARDEN",
    "PLANET",
    "MARKET",
    "BRIDGE",
    "LANTER",
    "DRAGON",
    "BEACON",
    "SILVER",
    "BUTTON",
    "STREAM",
  ],
};

let wordLength = Math.floor(Math.random() * 3) + 4;
let randomIndexWord = Math.floor(Math.random() * words[wordLength].length);
let chosenWord = words[wordLength][randomIndexWord];
const wordCopy = chosenWord;
let triesNumber = wordLength;
let hints = Math.floor(wordLength / 2);
let currentTry = 1;

console.log(chosenWord);

const allTries = document.querySelector(".all-tries");
const checkButton = document.querySelector("button.check");
const hintButton = document.querySelector("button.hint");
const newGameButton = document.querySelector("button.new-game");
let showedHints = Array(wordLength).fill(null);
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
  currentInputs = Array.from(
    document.querySelectorAll(`.try-${currentTry} input`)
  );
  currentInputs[0].focus();
}

function inputEvents() {
  Array.from(currentInputs).forEach((input, i, arr) => {
    input.addEventListener("input", () => {
      if (input.value !== " ") {
        input.value = input.value.toUpperCase();
        if (i < wordLength - 1) {
          for (let j = i; j < wordLength - 1; j++) {
            if (!arr[j + 1].disabled) {
              arr[j + 1].focus();
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
        for (let j = i; j > 0; j--) {
          if (!arr[j - 1].disabled) {
            arr[j - 1].focus();
            break;
          }
        }
      }
      if (e.key === "ArrowRight" && i < wordLength - 1) {
        // Goes To The Nearest Input To The Right
        for (let j = i; j < wordLength - 1; j++) {
          if (!arr[j + 1].disabled) {
            arr[j + 1].focus();
            break;
          }
        }
      }
      if (e.key === "Backspace" && i > 0) {
        input.value = "";
        for (let j = i; j > 0; j--) {
          if (!arr[j - 1].disabled) {
            arr[j - 1].value = "";
            arr[j - 1].focus();
            break;
          }
        }
      }
    });
  });
}

function checkWin() {
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
  currentInputs.forEach((e, i) => {
    if (!e.disabled) {
      if (e.value === chosenWord[i]) {
        showedHints[i] = chosenWord[i];
        chosenWord = setCharAt(chosenWord, i, "_");
        e.classList.add("in-place-color");
      } else if (chosenWord.includes(e.value)) {
        e.classList.add("not-in-place-color");
      } else {
        e.classList.add("wrong-color");
      }
    }
  });
}

function disableInputs() {
  document.querySelector(`.try-${currentTry}`).classList.add("disabled");
  currentInputs.forEach((e) => {
    e.disabled = true;
  });
}

function enableInputs() {
  document.querySelector(`.try-${currentTry}`).classList.remove("disabled");
  currentInputs.forEach((input, i) => {
    input.disabled = false;
    if (showedHints[i]) {
      input.value = showedHints[i];
      input.classList.add("in-place-color");
      input.disabled = true;
    }
  });
  if (currentTry <= triesNumber) {
    currentInputs[showedHints.indexOf(null)].focus();
  }
}

function disableButtons() {
  checkButton.disabled = true;
  hintButton.disabled = true;
  clearInterval(animation);
}

function getHint() {
  availableInputs = currentInputs.filter((e) => e.value === "");

  if (availableInputs.length !== 0) {
    hints--;

    document.querySelector("button.hint span").innerHTML = hints;

    randomIndex = Math.floor(Math.random() * availableInputs.length);

    input = availableInputs[randomIndex];

    indexOfLetter = currentInputs.indexOf(input);

    input.value = chosenWord[indexOfLetter];

    showedHints[indexOfLetter] = chosenWord[indexOfLetter];

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
    showMessage("YOU WIN!", true);
    disableButtons();
  } else if (currentTry === triesNumber) {
    showMessage(`YOU LOSE!<br>The word was '${wordCopy}'.`);
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
    if (showedHints.includes(null)) {
      currentInputs[showedHints.indexOf(null)].focus();
    }
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    checkButton.click();
  }
});

window.onload = function () {
  placeInputs();
  getCurrentInputs();
  inputEvents();
};
