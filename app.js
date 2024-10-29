/**********************************************
 * STARTER CODE
 **********************************************/

/**
 * shuffle()
 * Shuffle the contents of an array
 *   depending the datatype of the source
 * Makes a copy. Does NOT shuffle the original.
 * Based on Steve Griffith's array shuffle prototype
 * @Parameters: Array or string
 * @Return: Scrambled Array or string, based on the provided parameter
 */
function shuffle (src) {
  const copy = [...src]

  const length = copy.length
  for (let i = 0; i < length; i++) {
    const x = copy[i]
    const y = Math.floor(Math.random() * length)
    const z = copy[y]
    copy[i] = z
    copy[y] = x
  }

  if (typeof src === 'string') {
    return copy.join('')
  }

  return copy
}

/**********************************************
 * YOUR CODE BELOW
 **********************************************/



/* Set the words */
const words = ["apple", "banana", "cherry", "grape", "orange", "peach", "mango", "lemon", "melon", "berry"];


/* Define a scramble function that randomly changes the order of letters in words to mix and show words. */
function scramble(word) {
  return word.split("").sort(() => Math.random() - 0.5).join("");
}


/* Create a React component called Game that will handle the game. */
function Game() {
  /* Save the remaining words in the game */
  const [wordList, setWordList] = React.useState([]);
  /* the original word that the current user have to match */
  const [currentWord, setCurrentWord] = React.useState("");
  /* Scrambled Word is a word that mixes current Word. */
  const [scrambledWord, setScrambledWord] = React.useState("");
  /* score, strikes, and passes are the score, the number of incorrect. */
  const [score, setScore] = React.useState(0);
  const [strikes, setStrikes] = React.useState(0);
  const [passes, setPasses] = React.useState(3);
  /* The message represents the result message. */
  const [message, setMessage] = React.useState("");


    /* Get or initialize the old game state from local storage at the start of the game */
    React.useEffect(() => {
      const savedGame = JSON.parse(localStorage.getItem("scrambleGame"));
      if (savedGame) {
        setWordList(savedGame.wordList);
        setScore(savedGame.score);
        setStrikes(savedGame.strikes);
        setPasses(savedGame.passes);
        setNextWord(savedGame.wordList);
      } else {
        resetGame();
      }
    }, []);


    /* Define the game reset function */
    function resetGame() {
      const newWordList = [...words];
      setWordList(newWordList);
      setScore(0);
      setStrikes(0);
      setPasses(3);
      setNextWord(newWordList);
      setMessage("");
      localStorage.removeItem("scrambleGame");
    }


    /* The setNextWord function sets the following words. If the word list is empty, it sets the message that the game is over. */
    function setNextWord(wordList) {
      if (wordList.length > 0) {
        const nextWord = wordList[wordList.length - 1];
        setCurrentWord(nextWord);
        setScrambledWord(scramble(nextWord));
      } else {
        setMessage("Game Over! Click Play Again to restart.");
      }
    }


    /* Save the current state to local storage */
    function saveGame(newWordList, newScore, newStrikes, newPasses) {
      localStorage.setItem("scrambleGame", JSON.stringify({
        wordList: newWordList,
        score: newScore,
        strikes: newStrikes,
        passes: newPasses
      }));
    }


    /* Create function that verifies that the answer entered by the user is correct. */
    function handleGuess(event) {
      event.preventDefault();
      const guess = event.target.elements.guess.value.trim().toLowerCase();
      event.target.reset();
  
      if (guess === currentWord) {
        const newWordList = wordList.slice(0, -1);
        setScore(score + 1);
        setWordList(newWordList);
        setNextWord(newWordList);
        setMessage("Correct! Keep going!");
        saveGame(newWordList, score + 1, strikes, passes);
      } else {
        setStrikes(strikes + 1);
        setMessage("Incorrect! Try again.");
        saveGame(wordList, score, strikes + 1, passes);
        if (strikes + 1 >= 3) {
          setMessage("Game Over! You've reached the maximum strikes.");
        }
      }
    }


    /* If the passes remains, run the pass and reduce the remaining passes. */
    function handlePass() {
      if (passes > 0) {
        const newWordList = wordList.slice(0, -1);
        setPasses(passes - 1);
        setWordList(newWordList);
        setNextWord(newWordList);
        setMessage("Word skipped.");
        saveGame(newWordList, score, strikes, passes - 1);
      } else {
        setMessage("No passes left.");
      }
    }


    function handleRestart() {
      resetGame();
    }
  
    return (
      <div id="game">
        <h1>Scramble Game</h1>
        <div>Score: {score}</div>
        <div>Strikes: {strikes}</div>
        <div>Passes: {passes}</div>
        <div>Scrambled Word: {scrambledWord}</div>
        <form onSubmit={handleGuess}>
          <input type="text" name="guess" placeholder="Your guess..." required />
          <button type="submit">Submit Guess</button>
        </form>
        <button onClick={handlePass} disabled={passes <= 0}>Pass</button>
        <div>{message}</div>
        {wordList.length === 0 || strikes >= 3 ? (
          <button onClick={handleRestart}>Play Again</button>
        ) : null}
      </div>
    );
  }
  
  ReactDOM.createRoot(document.body).render(<Game />);