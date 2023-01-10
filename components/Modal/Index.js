import Avatar from "../Avatar";
import { useState } from "react";
import useUser from "../../hooks/useUser";
import Devit from "../Devit";

const Modal = () => {
  const user = useUser();
  const [closeModal, setCloseModal] = useState(true);
  return (
    <>
      <div>
        <Avatar src={user.avatar} alt={user.userName} />
        {closeModal ? (
          <button
            onClick={() => {
              setCloseModal(null);
            }}
          >
            X
          </button>
        ) : null}
      </div>

      <style jsx>{`
        div {
          display: ${closeModal ? "inline-block" : "none"};
          background-color: #555;
          position: absolute;
          top: 5rem;
          right: 0;
          border-radius: 10px;
          width: 90%;
          height: 50vh;
        }
        button {
          position: absolute;
          top: 5px;
          right: 5px;
          background-color: rgba(0, 0, 0, 0.8);
          color: white;
          font-size: 0.9rem;
          width: 1.875rem;
          height: 1.875rem;
          border-radius: 999px;
        }
      `}</style>
    </>
  );
};

export default Modal;
