const buttons = document.querySelectorAll("button");
const introGame = document.querySelector(".intro-game");
const startGameContainer = document.querySelector(".start-game");
const wordDiv = document.querySelector(".word");
const left = document.querySelector(".left");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector('.highScore');
var score = 0;

//Get random words from API
const getRandomWords = (wordCount, guessingLeft) => {
  fetch(`https://puzzle.mead.io/puzzle?wordCount=${wordCount}`)
    .then((response) => response.json())
    .then((response) => {
      startGame(response.puzzle, guessingLeft, wordCount);
    })
    .catch((error) => console.log(error));
};

buttons.forEach((button) => {
  button.addEventListener("click", (e) => {
    displayComponent();
    if (button.innerText === "Easy") getRandomWords(1, 3);
    else if (button.innerText === "Medium") getRandomWords(2, 4);
    else if (button.innerText === "Hard") getRandomWords(3, 5);
    else if (button.innerText === "Reset") {
      wordDiv.innerHTML = "";
      score = 0;
      scoreElement.innerHTML = score;
      document.removeEventListener("keypress", key);
    }
    e.preventDefault();
  });
});

const displayComponent = () => {
  if (introGame.classList.contains("hide")) {
    introGame.classList.remove("hide");
    startGameContainer.classList.remove("show");
  } else {
    introGame.classList.add("hide");
    startGameContainer.classList.add("show");
  }
};

const startGame = (word, guessingLeft, wordCount) => {
  for (var i = 0; i < word.length; i++) {
    if (word[i] === " ") {
      wordDiv.innerHTML += " ";
    } else {
      wordDiv.innerHTML += "*";
    }
  }
  left.innerHTML = guessingLeft;
  guessWord(word, guessingLeft, wordCount);
};

const guessWord = (word, guessingLeft, wordCount) => {
  word = word.toLowerCase();
  document.addEventListener(
    "keypress",
    (key = (e) => {
      var keyName = e.key.toLowerCase();
      if (keyName.match("[a-zA-Z]+") && word.includes(keyName)) {
        let index = findIndex(word, keyName);
        updateDisplayWord(index, keyName, word, wordCount, guessingLeft);
        highScoreElement.innerHTML = score
      } else {
        --guessingLeft;
        if (guessingLeft === 0) {
          left.innerText = `Nice Try! The word is "${word}"`;
          setTimeout(() => {
            wordDiv.innerHTML = "";
            document.removeEventListener("keypress", key);
            score = 0;
            scoreElement.innerHTML = score;
            displayComponent();
          }, 2000);
        } else {
          left.innerHTML = guessingLeft;
        }
      }
    })
  );
};

const updateDisplayWord = (index, keyName, word, wordCount, guessingLeft) => {
  const displayWord = wordDiv.innerHTML.split("");
  index.forEach((i) => {
    displayWord[i] = keyName;
  });
  wordDiv.innerHTML = displayWord.join("");
  if (wordDiv.innerHTML === word) {
    score++;
    scoreElement.innerText = score;
    reset(wordCount, guessingLeft);
  }
};

const findIndex = (word, keyName) => {
  word = word.split("");
  let indexes = [];
  word.filter((letter, index) => {
    letter === keyName ? indexes.push(index) : null;
  });
  return indexes;
};

const reset = (wordCount, guessingLeft) => {
  wordDiv.innerHTML = "";
  document.removeEventListener("keypress", key);
  getRandomWords(wordCount, guessingLeft);
};
