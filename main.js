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
let triesNumber = wordLength;
let hints = Math.floor(wordLength / 2);
let currentTry = 1;

const allTries = document.querySelector(".all-tries");
const checkButton = document.querySelector("button.check");
const hintButton = document.querySelector("button.hint");
const newGameButton = document.querySelector("button.new-game");
let currentInputs;

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

function toNextInput() {
  Array.from(currentInputs).forEach((input, i, arr) => {
    input.addEventListener("input", () => {
      if (input.value !== " ") {
        input.value = input.value.toUpperCase();
        if (i < currentInputs.length - 1) {
          arr[i + 1].focus();
        }
      } else {
        input.value = "";
      }
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft" && i > 0) {
        arr[i - 1].focus();
      }
      if (e.key === "ArrowRight" && i < currentInputs.length - 1) {
        arr[i + 1].focus();
      }
      if (e.key === "Backspace" && i > 0) {
        input.value = "";
        if (arr[i - 1].disabled !== true) {
          arr[i - 1].value = "";
          arr[i - 1].focus();
        }
      }
    });
  });
}

function checkWin() {
  return (
    currentInputs.filter((e, i) => e.value === chosenWord[i]).length ===
    wordLength
  );
}

function showMessage(msg) {
  const message = document.querySelector(".message");
  const para = document.createElement("p");
  message.appendChild(para);
  para.innerHTML = msg;
}

function colorInputs() {
  currentInputs.forEach((e, i) => {
    e.style.color = "white";
    if (e.value === chosenWord[i]) {
      e.classList.add("in-place-color");
    } else if (chosenWord.includes(e.value)) {
      e.classList.add("not-in-place-color");
    } else {
      e.classList.add("wrong-color");
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
  currentInputs.forEach((e) => {
    e.disabled = false;
  });
  currentInputs[0].focus();
}

function disableButtons() {
  checkButton.disabled = true;
  hintButton.disabled = true;
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

    input.classList.add("in-place-color");

    input.disabled = true;

    input.style.color = "white";
  }
  if (hints == 0) {
    hintButton.disabled = true;
  }
}

checkButton.addEventListener("click", () => {
  colorInputs();
  disableInputs();
  if (checkWin()) {
    showMessage("YOU WIN!");
    disableButtons();
  } else if (currentTry === triesNumber) {
    showMessage(`YOU LOSE!<br>The word was '${chosenWord}'.`);
    disableButtons();
  } else {
    currentTry++;
    getCurrentInputs();
    enableInputs();
    toNextInput();
  }
});

newGameButton.addEventListener("click", () => {
  window.location.reload();
});

hintButton.addEventListener("click", () => {
  if (hints > 0) {
    getHint();
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
  toNextInput();
};
