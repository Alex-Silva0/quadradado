import { JSX } from "react";
import "./Info.css";
import Popup from "./Popup";
import { useDispatch, useSelector } from "react-redux";
import { gameActions } from "../store";

interface WordsStatusProps {
  numberOfLetters: number;
  wordsFound: string[];
  totalWords: number;
}

/**
 * Mostra o status das palavras: encontradas, bônus e restantes
 * 
 * Se numberOfLetters for -1 é considerada uma palavra bônus
 */
function WordStatus({ numberOfLetters, wordsFound, totalWords }: WordsStatusProps) {
  const wordsLeft = totalWords - wordsFound.length;

  return <div className='amount-wrapper'>
    <div className='amount-bold'>
      {numberOfLetters == -1 ? "Palavras bônus" : `${numberOfLetters} letras`}
    </div>
    <div className='words-found'>
      {
        wordsFound.map(word => <a key={word} className="word-found" target='_blank' href={`https://www.dicio.com.br/${word}/`} rel="noreferrer">{word}</a>)
      }
    </div>
    <div className='words-left'>
      {wordsLeft > 0 ? `+${wordsLeft} palavras restantes` : null}
    </div>
  </div>;
}

// numberOfLettersAndWords mapeia um número x com as palavras que tem x letras
type InfoProps = {
  numberOfLettersAndWords: Map<number, WordsWithXLetters>;
}

export default function Info({ numberOfLettersAndWords }: InfoProps) {
  const showPopup = useSelector<GameState>((state) => state.showPopup) as boolean;
  const dispatch = useDispatch();
  const wordsStatusArray: JSX.Element[] = [];

  const orderedKeys = Array.from(numberOfLettersAndWords.keys()).sort((a, b) => a - b);
  orderedKeys.forEach((key) => {
    if (key == -1) return;
    const words = numberOfLettersAndWords.get(key) as WordsWithXLetters;
    wordsStatusArray.push(<WordStatus key={key} wordsFound={words.wordsFoundWithXLetters} numberOfLetters={key} totalWords={words.totalWords} />);
  });

  const bonus = numberOfLettersAndWords.get(-1) as WordsWithXLetters;
  wordsStatusArray.push(<WordStatus key="-1" wordsFound={bonus.wordsFoundWithXLetters} numberOfLetters={-1} totalWords={bonus.totalWords} />);

  function handleCloseOverlay() {
    dispatch(gameActions.hidePopup());
  }

  return <>
    {
      showPopup ?
        <Popup onPopUpClose={handleCloseOverlay} popupTitle="Palavras">
          {wordsStatusArray}
        </Popup> :
        <div id='main-info-wrapper' className="overflow-y">
          {wordsStatusArray}
        </div>
    }
  </>;
}
