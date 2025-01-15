import { useEffect, useState } from "react";
import { ExpandIcon } from "../Icons";
import { useDispatch } from "react-redux";
import { gameActions } from "../store";

type WordsCountProps = {
  children: React.ReactNode;
}

export default function WordsCount({ children }: WordsCountProps) {
  const [windowSize, setWindowSize] = useState(window.innerWidth);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleResize = () => {
      setWindowSize(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <div id='words-count-wrapper' onClick={() => {
    if (windowSize < 700) dispatch(gameActions.showPopup());
  }}>
    {children}
    {windowSize < 700 ? <ExpandIcon /> : null}
  </div>;
}
