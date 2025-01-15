import { createSlice, configureStore } from "@reduxjs/toolkit";
import { board } from "../Constants";
import { WritableDraft } from "immer";
import { rotateBoard, updateMessage } from "./board";

const initialGameState: GameState = {
  wordsFound: [],
  message: null,
  fadeMessage: false,
  showPopup: false,
  positionsSelected: [],
  isSelectionStarted: false,
  board: board
};

const hideMessage = (state: WritableDraft<GameState>) => {
  state.fadeMessage = true;
};

const gameSlice = createSlice({
  name: "game",
  initialState: initialGameState,
  reducers: {
    showPopup(state) {
      state.showPopup = true;
    },
    hidePopup(state) {
      state.showPopup = false;
    },
    showMessage(state) {
      state.fadeMessage = false;
    },
    hideMessage(state) {
      hideMessage(state);
    },
    setMessage(state, action) {
      state.message = action.payload;
    },
    setWordsFound(state, action) {
      state.wordsFound = action.payload;
    },
    endSelection(state) {
      state.isSelectionStarted = false;
      if (state.positionsSelected.length > 1) {
        updateMessage(state);
      } else {
        hideMessage(state);
      }

      state.positionsSelected = [];
    },
    rotateBoard(state) {
      rotateBoard(state);
    },
    returnToLastSelection(state) {
      const nextPositionsSelected = state.positionsSelected.slice(0, -1);
      state.positionsSelected = nextPositionsSelected;
      state.isSelectionStarted = true;
      updateMessage(state);
    },
    updatePositions(state, action) {
      const nextPositionsSelected = [...state.positionsSelected, { index: action.payload.boardIndex, x: action.payload.x, y: action.payload.y }];
      state.positionsSelected = nextPositionsSelected;
      state.isSelectionStarted = true;
      updateMessage(state);
    }
  }
});

const store = configureStore({
  reducer: gameSlice.reducer
});

export const gameActions = gameSlice.actions;

export default store;
