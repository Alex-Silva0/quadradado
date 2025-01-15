import { useEffect, useRef, useState } from "react";
import "./Board.css";
import Line from "./Line";
import { RotateRightIcon } from "../Icons";
import { useDispatch, useSelector } from "react-redux";
import { gameActions } from "../store";

type PointerEv = React.PointerEvent<HTMLDivElement>;

interface LetterProps {
  letter: string;
  className: string;
  handleLetterClicked: (event: PointerEv) => void;
  handlePointerOver: (event: PointerEv) => void;
};

function Letter({ letter, className, handleLetterClicked, handlePointerOver: handlePointerOver }: LetterProps) {

  return <div
    onContextMenu={(e) => e.preventDefault()}
    className={className}
    onPointerDown={handleLetterClicked}
  >
    {letter}
    <div className='hoverable-area' onPointerOver={handlePointerOver}>
    </div>
  </div>;
}

function getPos(clickedElement: HTMLElement) {
  const r = clickedElement.getBoundingClientRect();

  const posX = r.x + clickedElement.offsetWidth / 2;
  const posY = r.y + clickedElement.offsetHeight / 2;

  return ({
    x: posX,
    y: posY
  });
}

export default function Board() {
  const dispatch = useDispatch();
  const positionsSelected = useSelector<GameState>((state) => state.positionsSelected) as Position[];
  const isSelectionStarted = useSelector<GameState>((state) => state.isSelectionStarted) as boolean;
  const board = useSelector<GameState>((state) => state.board) as string[][];
  const fadeMessageTimer = useRef<number | null>(null);

  useEffect(() => {
    function handleMouseUp() {
      if (isSelectionStarted) {
        if (fadeMessageTimer.current !== null) {
          window.clearTimeout(fadeMessageTimer.current);
        }

        dispatch(gameActions.endSelection());

        // oculta a mensagem depois de 2 segundos após o fim da seleção
        fadeMessageTimer.current = window.setTimeout(() => {
          fadeMessageTimer.current = null;
          dispatch(gameActions.hideMessage());
        }, 2000);
      }
    }

    document.addEventListener("pointerup", handleMouseUp);

    return () => {
      document.removeEventListener("pointerup", handleMouseUp);
    };
  }, [isSelectionStarted]);

  const [isRotating, setIsRotating] = useState(false);

  function _compareBoardCoord(index1: BoardCoord, index2: BoardCoord) {
    return index1.row == index2.row && index1.column == index2.column;
  }

  function _isIndexInPositionList(index: BoardCoord) {
    return (positionsSelected.filter(el => _compareBoardCoord(index, el.index))).length > 0;
  }

  function handlePointerOver(boardIndex: BoardCoord, event: PointerEv) {
    if (!isSelectionStarted) return;

    // undo selection
    if (positionsSelected.length >= 2 && _compareBoardCoord(boardIndex, positionsSelected[positionsSelected.length - 2].index)) {
      // remove last in list
      dispatch(gameActions.returnToLastSelection());
      return;
    }

    if (_isIndexInPositionList(boardIndex)) return;

    // avoid selecting out of range of surroundings
    const previousBoardIndex = positionsSelected[positionsSelected.length - 1].index;
    if (Math.abs(previousBoardIndex.row - boardIndex.row) > 1 || Math.abs(previousBoardIndex.column - boardIndex.column) > 1) return;
    const element = (event.target as HTMLElement);
    const pos = getPos(element);

    dispatch(gameActions.updatePositions({
      x: pos.x,
      y: pos.y,
      boardIndex
    }));
  }

  function handleLetterClicked(boardIndex: BoardCoord, event: PointerEv) {
    if (isSelectionStarted) return;

    const element = (event.target as HTMLElement);
    const pos = getPos(element);

    dispatch(gameActions.updatePositions({
      x: pos.x,
      y: pos.y,
      boardIndex
    }));

    element.releasePointerCapture(event.pointerId);
    event.preventDefault();
  }

  let dot = null;
  if (positionsSelected.length > 0) {
    const styles: React.CSSProperties = {
      top: `${positionsSelected[0].y - 17}px`,
      left: `${positionsSelected[0].x - 17}px`,
    };

    dot = <div className='dot' style={styles}></div>;
  }

  function handleRoateBoard() {
    setIsRotating(true);
  }

  const handleAnimationEnd = (event: React.AnimationEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      dispatch(gameActions.rotateBoard());
      setIsRotating(false);
    }
  };

  return <>
    <div id='board-wrapper'>
      <div id='board' className={isRotating ? "board-rotate" : undefined} onAnimationEnd={handleAnimationEnd}>
        {
          board.map((row, y) => row.map((letter, x) => {
            const boardIndex = { row: y, column: x };
            let className = _isIndexInPositionList(boardIndex) ? "letter used" : "letter";
            if (isRotating) className += " rotate-reverse";

            return <Letter
              className={className}
              letter={letter}
              key={x + "-" + y}
              handleLetterClicked={(ev) => handleLetterClicked(boardIndex, ev)}
              handlePointerOver={(ev) => handlePointerOver(boardIndex, ev)}
            />;
          }))
        }

      </div>
      <div onClick={handleRoateBoard} id='rotate-board-btn'>
        <RotateRightIcon />
      </div>
    </div>
    <div id='lines'>
      {dot}
      {
        positionsSelected.map((position, index) => {
          if (index + 1 == positionsSelected.length) return null;
          const next = positionsSelected[index + 1];

          return <Line
            key={index}
            x1={position.x}
            y1={position.y}
            x2={next.x}
            y2={next.y} />;
        })
      }
    </div>
  </>;
}
