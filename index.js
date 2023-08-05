const fiveLetterWords = require("./words.json");
const prompt = require("prompt");
const chalk = require("chalk");

prompt.message = "";

function getRandomWord() {
  return fiveLetterWords[
    Math.floor(Math.random() * fiveLetterWords.length)
  ].toUpperCase();
}

async function getGuess() {
  let userInput = await prompt.get("guess").catch(() => process.exit(1));

  while (userInput.guess.length != 5) {
    console.log(
      chalk.red.bold("Your guess was not 5 characters long! Try again.")
    );
    userInput = await prompt.get(["guess"]).catch(() => process.exit(1));
  }

  return userInput.guess.toUpperCase();
}

function showWordWithHighlights(expectedWord, guess) {
  let wordWithHighlights = "";
  for (let i = 0; i < 5; i++) {
    if (expectedWord[i] === guess[i]) {
      wordWithHighlights += chalk.bgGreenBright.black(guess[i]);
    } else if (expectedWord.includes(guess[i])) {
      wordWithHighlights += chalk.bgYellowBright.black(guess[i]);
    } else {
      wordWithHighlights += chalk.bgGray.black(guess[i]);
    }
  }
  console.log(wordWithHighlights);
}

async function playGame() {
  const expectedWord = getRandomWord();
  const totalGuessesAllowed = 6;
  let guessNumber = 1;

  do {
    let guess = await getGuess();
    if (guess === expectedWord) {
      console.log(chalk.green.bold(`You got it in ${guessNumber} guess(es)`));
      return;
    } else {
      showWordWithHighlights(expectedWord, guess);
      console.log(
        `You have ${totalGuessesAllowed - guessNumber} guess(es) left`
      );
    }

    guessNumber++;
  } while (guessNumber <= totalGuessesAllowed);

  console.log(
    chalk.redBright.bold(
      `Sorry! The word was ${expectedWord}. Better luck next time :)`
    )
  );
}

playGame();
