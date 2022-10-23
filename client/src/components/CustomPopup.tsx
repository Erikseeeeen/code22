import React, { useState } from "react";
import "./popup.css";

type PopupProps = {
  trigger: JSX.Element;
  children: JSX.Element;
};

const CustomPopup: React.FC<PopupProps> = ({ trigger, children }) => {
  const [visible, setVisible] = useState(false);

  const handleExit = () => {
    if (document.activeElement?.classList.length === 0) {
      setVisible(!visible);
    }
  };
  return (
    <>
      {React.cloneElement(trigger, { onClick: () => setVisible(!visible) })}
      {visible && (
        <div className="popup-box" onClick={() => handleExit()}>
          <div className="popup-content" tabIndex={-1}>
            {React.cloneElement(children, {
              toggleVisible: () => setVisible(!visible),
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default CustomPopup;
