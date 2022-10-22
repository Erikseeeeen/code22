import React, { useState } from "react";
import "./popup.css";

type PopupProps = {
  trigger: JSX.Element;
  children: React.ReactNode;
};

const CustomPopup: React.FC<PopupProps> = ({ trigger, children }) => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      {React.cloneElement(trigger, { onClick: () => setVisible(!visible) })}
      {visible && (
        <div className="popup-box">
          <div className="popup-content">{children}</div>
        </div>
      )}
    </>
  );
};

export default CustomPopup;
