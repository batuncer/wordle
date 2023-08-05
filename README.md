# Wordle CLI Clone

This is a Wordle CLI clone built in NodeJS. The original Wordle game can be found here: https://www.nytimes.com/games/wordle/index.html

## STEP 1: Initial Setup
- Create a folder called `wordle-clone`, and run `npm init` in the folder
- Create a new `wordle.js` file - all remaining code changes will take place in this file
- To keep things tidy, let's start by creating a `playGame` function that will hold all the code needed to play a game of Wordle:
```javascript
function playGame() {
    console.log("Playing Wordle...");
}

playGame();
```

## STEP 2: High-level Breakdown
Now, let's think about how this application should work from a high-level:
- Each time we play, the user will need to guess a random word, so it would be useful to have a word list to select from.
    - Let's copy in the provided `words.json` file, which contains an array of 5-letter words.
    - We can import the array of words using:
        ```javascript
        const fiveLetterWords = require("./words.json");
        ```
- First, we'll need to decide what word the player needs to guess - so let's create a function to do this for us. We can worry about the implementation later.
    ```javascript
    function getRandomWord() {
        // TODO
        return "HAPPY";
    }
    ```
- Next, we need to be able to retrieve a guess from the user - let's have a placeholder function for this as well:
    ```javascript
    function getGuess() {
       // TODO
        return "GUESS";
    }
    ```
- After we have the user's guess, what should we do next?
    - If the user's guess is correct, we can tell them they've won!
    - If the user's guess is not correct, we can show them their word with highlights. This might be a bit more complicated, so let's create a function to do this for us:
        ```javascript
        function showWordWithHighlights(expectedWord, guess) {
            // TODO
            console.log("HAPPY");
        }
        ```
- If the user's guess was not correct, we'll need to get their next guess and check again. We'll have to keep repeating these steps until they guess correctly or run out of steps. This sounds like a job for a loop.
    - We know that the user will always make at least one guess - can we think of a loop that will execute at least one time? How about a `do-while` loop?
    - We can initialise a variable to keep track of how many guesses the user has made, and end the loop when they've reached 6 guesses.
    - If the user guesses correctly, we can end the game by exiting the `playGame` function (using `return`).
    - If they've run out of guesses, we can let them know that they've lost the game :(
- We now have a good high-level understanding of how to implement this game. It's time to get into the details of how to implement each of our placeholder functions.

## STEP 3: Implement `getRandomWord` function
We want to retrieve a random word from the `fiveLetterWords` array. We can do this by generating a random number between 0 and `fiveLetterWords.length` and treating this number as an index for an element in the array.
- We can generate the index using:
    ```javascript
    Math.floor(Math.random() * fiveLetterWords.length)
    ```
- Refresh your understanding of these functions if you need to:
    - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/floor
    - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random

## STEP 4: Implement `getGuess` function
In NodeJS, there are a few different ways to retrieve user input from the command line. A quick Google search brings up this article: https://nodejs.org/en/knowledge/command-line/how-to-prompt-for-command-line-input/. To keep things simple, we'll use the `prompt` package mentioned in the article.
- Take a moment to read about `prompt` here: https://www.npmjs.com/package/prompt
- Run `npm install prompt` to include this package in your project
- Next, we'll need to import prompt using:
    ```javascript
        const prompt = require("prompt");
    ```
- Looking at the documentation, we can use the `prompt.get` function to ask the user for some input. If we don't put a callback in the second parameter, the function will return a `Promise`. We've seen promises before when working with the `fetch` function to retrieve information from an API.
    ```javascript
        let userInputPromise = prompt.get("guess");
    ```
    However, we can use `async/await` here to make our lives _much_ easier. Remember that you can only use `await` in a function that is declared as `async`.
    ```javascript
        let userInput = await prompt.get("guess");
    ```
    Here, `userInput` is an object that contains a property called `guess` - so we can just return this value:
    ```javascript
        return userInput.guess.toUpperCase();
    ```
- A couple of points to make the user's experience a bit nicer.
    - At the moment, if they CTRL-C out of the prompt, they'll get an ugly error output in the terminal. We can handle this error and exit the game using `Promise.catch`:
        ```javascript
            let userInput = await prompt.get("guess").catch(() => process.exit(1));
        ```
    - We're also seeing "prompt:" being output before "guess:". According to the documentation we can customise this using `prompt.message`. Because we only need to set this once, we can add it to the top of the file:
        ```javascript
            prompt.message = "";
        ```

## STEP 5: Implement `showWordWithHighlights` function
It's time to add some color to our app! We need to follow a few rules here:
- If the letter is in the word AND in the correct position, we can highlight it in green
- If the letter is in the word BUT is not in the correct position, we can highlight it in yellow
- If the letter is not in the word, we can highlight it in gray

A quick Google search for "nodejs terminal color" shows us a few different options. Let's go with `chalk` for now and see how it goes: https://www.npmjs.com/package/chalk
- Let's first install chalk using: `npm install chalk@4.x` _(we're staying on the 4.x version here because this will allow us to continue using `require`)_
- Next, we'll import it into our `wordle.js` file using:
    ```javascript
    const chalk = require("chalk");
    ```
- In our `showWordWithHighlights` function, we can build up our highlighted string letter-by-letter and then finally output it to the console.
    - A basic `for` loop should do the job for us here:
        ```javascript
            for (let i = 0; i < 5; i++) { ... }
        ```
    - Looking at the `chalk` documentation, we can chain together multiple styles. Something like this might work for us, but feel free to get creative:
        ```javascript
            chalk.bgGreenBright.black(guess[i])
        ```

## STEP 6: Improve User Experience
We now have a working version of Wordle running in our terminal! However, there's a couple of things we can do to improve the user experience.
- The user is only allowed to guess 5-letter words, so we could keep prompting them if they don't enter a 5-letter word:
    ```javascript
        while (userInput.guess.length != 5) {
	    	console.log(chalk.red.bold("Your guess was not 5 characters long! Try again."));
		    userInput = await prompt.get(["guess"]).catch(() => process.exit(1));
	    }
    ```
- Also, not too important, but we could add some color to our winning and losing messages:
    ```javascript
        chalk.green.bold(`You got it in ${guessNumber} guess(es)`)
    ```

## Stretch Ideas
Where can you take this from here? What other variations can you think of?
- Maybe tweaking the rules to allow more guesses or fewer guesses?
- Try different word lengths? Maybe a 6-letter version?
- How about Wordle in a different language?
- Or maybe come up with a completely different game, and see if you can make it a reality?