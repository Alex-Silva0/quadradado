import Board from "./Board";
import Info from "./Info";
import WordsCount from "./WordsCount";
import { wordsList, bonusWords } from "../Constants";
import "./Game.css";
import { useDispatch, useSelector } from "react-redux";
import { gameActions } from "../store";
import { useEffect, useRef } from "react";

const totalWords = wordsList.length;

/**
 * Mostra a palavra selecionada até então, ou alguma mensagem de feedback
 */
function MessageComponent() {
  const fadeMessage = useSelector<GameState>((state) => state.fadeMessage) as boolean;
  const message = useSelector<GameState>((state) => state.message) as Message | null;

  return <div id='message-wrapper'>
    <span id='message' className={fadeMessage ? "fading" : ""}>
      {message ? message.type == "status" ? message.msg : <div className="word">{message.msg}</div> : null}
    </span>
  </div>;
}

/**
 * Componente principal do jogo
 */
export default function Game() {
  const wordsFound = useSelector<GameState>(state => state.wordsFound) as string[];
  const isFirstMount = useRef(true);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isFirstMount.current) {
      return;
    }

    isFirstMount.current = false;

    // Check for words found saved on local storage
    const wordsFound = localStorage.getItem("wordsFound");
    if (wordsFound) {
      dispatch(gameActions.setWordsFound(JSON.parse(wordsFound)));
    }
  }, []);

  const numberOfLettersAndWords: Map<number, WordsWithXLetters> = new Map();

  for (let i = 0; i < wordsList.length; i++) {
    const word = wordsList[i];
    const info = numberOfLettersAndWords.get(word.length);
    if (info) {
      numberOfLettersAndWords.set(word.length, {
        ...info,
        totalWords: info.totalWords += 1
      });
    } else {
      const wordsFoundWithXLetters = [];
      for (const wordFound of wordsFound) {
        if (wordFound.length == word.length && !bonusWords.includes(wordFound)) {
          wordsFoundWithXLetters.push(wordFound);
        }
      }

      numberOfLettersAndWords.set(word.length, {
        totalWords: 1,
        wordsFoundWithXLetters
      });
    }
  }

  let bonusWordsFoundCount = 0;
  const bonusWordsFound: string[] = [];
  for (const word of wordsFound) {
    if (bonusWords.includes(word)) {
      bonusWordsFound.push(word);
      bonusWordsFoundCount++;
    }
  }

  numberOfLettersAndWords.set(-1, {
    totalWords: bonusWords.length,
    wordsFoundWithXLetters: bonusWordsFound
  });

  return (
    <>
      <Info numberOfLettersAndWords={numberOfLettersAndWords} />
      <div id='main-game'>
        <div id='over-board'>
          <WordsCount>
            <span>{wordsFound.length - bonusWordsFoundCount} / {totalWords} palavras</span>
            {bonusWordsFound && bonusWordsFound.length > 0 ? <span id="bonus-words-count">+{bonusWordsFoundCount}</span> : null}
          </WordsCount>
          <MessageComponent />
        </div>
        <Board />
      </div>
    </>
  );
}
