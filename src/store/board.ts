import { WritableDraft } from "immer";
import { bonusWords, wordsList } from "../Constants";

export const rotateBoard = (state: WritableDraft<GameState>) => {
  const newBoard: string[][] = [];
  for (let col = 0; col < state.board[0].length; col++) {
    const newRow: string[] = [];
    for (let row = state.board.length - 1; row >= 0; row--) {
      newRow.push(state.board[row][col]);
    }
    newBoard.push(newRow);
  }

  state.board = newBoard;
};

function getWord(board: string[][], value: Position[]) {
  return value.reduce((total, pos) => total + board[pos.index.row][pos.index.column], "");
}

export const updateMessage = (state: WritableDraft<GameState>) => {
  const addWordFound = (wordFound: string) => {
    localStorage.setItem("wordsFound", JSON.stringify([...state.wordsFound, wordFound]));
    state.wordsFound.push(wordFound);
  };

  const selectionEnded = !state.isSelectionStarted;
  const type = selectionEnded ? "status" : "word";
  let word = getWord(state.board, state.positionsSelected);
  let newMessage: Message;

  if (selectionEnded) {
    word = word.toLowerCase();
    if (state.wordsFound.includes(word)) {
      newMessage = { msg: "Palavra já encontrada", type };
    } else if (wordsList.includes(word)) {
      newMessage = { msg: "Palavra encontrada!", type };
      addWordFound(word);
    } else if (bonusWords.includes(word)) {
      newMessage = { msg: "Palavra bônus encontrada!", type };
      addWordFound(word);
    } else if (word.length < 4) {
      newMessage = { msg: "A palavra é muito curta", type };
    } else {
      newMessage = { msg: "A palavra não está na lista", type };
    }
  } else {
    newMessage = { msg: word, type };
  }

  state.message = newMessage;
  state.fadeMessage = false;
};
