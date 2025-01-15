declare interface Position {
    index: BoardCoord;
    x: number;
    y: number;
}

declare interface Message {
    msg: string;
    type: "word" | "status";
}

declare interface GameState {
    wordsFound: string[];
    message: Message | null;
    fadeMessage: boolean;
    showPopup: boolean
    positionsSelected: Position[];
    isSelectionStarted: boolean;
    board: string[][]
}

declare type BoardCoord = {
    row: number,
    column: number
}

declare type WordsWithXLetters = {
    wordsFoundWithXLetters: string[],
    totalWords: number
}