import { IconClose } from "../Icons";
import "./Popup.css";

type PopupProps = {
  children: React.ReactNode;
  onPopUpClose: () => void;
  popupTitle: string;
}

/**
 * Mostra um popup
 * react portals poderia ser utilizado aqui
 */
export default function Popup({ children, popupTitle, onPopUpClose }: PopupProps) {
  return <>
    <div className='popup'>
      <div id='popup-title-wrapper'>
        <h2 className='title'>{popupTitle}</h2>
        <div onClick={onPopUpClose} id='close-button'>
          <IconClose />
        </div>
      </div>
      <hr />
      <div className="overflow-y">
        {children}
      </div>
    </div>
    <div id='overlay'></div>
  </>;
}
