import { useState, useEffect } from "react";
import { colors } from "../../styles/theme";
import useUser from "../../hooks/useUser";
import { addDevit, uploadImage } from "../../firebase/client";
import { getDownloadURL } from "firebase/storage";
import Button from "../Button";
import Avatar from "../Avatar";
import LenghtCount from "../LengthCount";

import dynamic from "next/dynamic";

//Router
import Router from "next/router";
import UploadImageIcon from "../Icons/UploadImageIcon";
import EmojiIcon from "../Icons/EmojiIcon";

const COMPOSE_STATES = {
  USER_NOT_KNOWN: 0,
  LOADING: 1,
  SUCCESS: 2,
  NONE: 3,
  ERROR: -1,
  ERROR_LENGTH: -2,
};

const DRAG_IMAGE_STATES = {
  ERROR: -1,
  NONE: 0,
  DRAG_OVER: 1,
  UPLOADING: 2,
  COMPLETE: 3,
};

export default function ComposeHome() {
  const Picker = dynamic(
    () => {
      return import("emoji-picker-react");
    },
    { ssr: false }
  );

  const user = useUser();
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(COMPOSE_STATES.USER_NOT_KNOWN);

  //estados para subir imagenes
  const [drag, setDrag] = useState(COMPOSE_STATES.NONE);
  const [task, setTask] = useState(null);
  const [imgURL, setImgURL] = useState(null);

  //iconos
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    if (task) {
      //Progreso
      task.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        //En caso de error
        (error) => {
          switch (error.code) {
            case "storage/unauthorized":
              // User doesn't have permission to access the object
              break;
            case "storage/canceled":
              // User canceled the upload
              break;
            // ...
            case "storage/unknown":
              // Unknown error occurred, inspect error.serverResponse
              break;
          }
        },
        //Proceso completado
        () => {
          getDownloadURL(task.snapshot.ref).then((downloadURL) => {
            setImgURL(downloadURL);
            console.log("File available at", downloadURL);
          });
        }
      );
    }
  }, [task]);

  const handleChange = (e) => {
    const { value } = e.target;
    if (value.length >= 140) {
      setStatus(COMPOSE_STATES.ERROR_LENGTH);
    } else {
      setStatus(COMPOSE_STATES.NONE);
    }
    setMessage(value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setStatus(COMPOSE_STATES.LOADING);
    addDevit({
      avatar: user.avatar,
      content: message,
      img: imgURL,
      userId: user.uid,
      userName: user.username,
    });
    try {
      Router.push("/");
    } catch (error) {
      console.error(error);
      setStatus(COMPOSE_STATES.ERROR);
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setDrag(DRAG_IMAGE_STATES.DRAG_OVER);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setDrag(DRAG_IMAGE_STATES.NONE);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setDrag(DRAG_IMAGE_STATES.NONE);
    const file = e.dataTransfer.files[0];
    const task = uploadImage(file);
    setTask(task);
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    const task = uploadImage(file);
    setTask(task);
  };

  const isButtonDisabled =
    (message.length === 0 && !imgURL) ||
    status === COMPOSE_STATES.LOADING ||
    status === COMPOSE_STATES.ERROR_LENGTH;

  const addEmoji = (e) => {
    let sym = e.unified.split("-");
    let codesArray = [];
    sym.forEach((el) => codesArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codesArray);
    setMessage(message + emoji);
  };

  return (
    <>
      <section className='form-container'>
        {user ? (
          <section className='avatar-container'>
            <Avatar src={user.avatar} />
          </section>
        ) : null}

        <form onSubmit={handleSubmit}>
          <textarea
            onChange={handleChange}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            value={message}
            placeholder='¿Que está pasando?'
          ></textarea>

          <div className='img-icon-container'>
            <label
              for='file'
              onChange={(file) => {
                handleUpload(file);
              }}
            >
              <UploadImageIcon width={25} height={25} fill={colors.primary} />
              <input id='file' type='file' />
            </label>
            <EmojiIcon
              width={25}
              height={25}
              fill={colors.primary}
              onClick={() => setShowPicker((val) => !val)}
            />
            {message ? (
              <LenghtCount
                height={25}
                width={25}
                strokeWidth={8}
                percentage={message.length}
              />
            ) : null}
          </div>
          {showPicker && (
            <Picker onEmojiClick={addEmoji} height={400} width='270px' />
          )}

          {imgURL ? (
            <section className='remove-img'>
              <button
                onClick={() => {
                  setImgURL(null);
                }}
              >
                X
              </button>
              <img src={imgURL}></img>
            </section>
          ) : null}
          <div className='submit-btn'>
            <Button disabled={isButtonDisabled}>Devittear</Button>
          </div>
        </form>
      </section>

      <style jsx>{`
        div {
          padding: 15px;
        }

        .submit-btn {
          padding-left: 0;
        }

        form {
          margin: 10px;
          display: flex;
          flex-direction: column;
          width: 100%;
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
          cursor: pointer;
          border-radius: 999px;
        }

        .img-icon-container {
          display: flex;
          justify-content: start;
          gap: 0.5rem;
          margin-top: 12px;
          padding: 7px 0;
        }

        label {
          height: 25px;
        }

        input[type="file"]#file {
          width: 0.1px;
          height: 0.1px;
          opacity: 0;
          overflow: hidden;
          position: absolute;
          z-index: -1;
        }

        .form-container {
          display: flex;
          align-items: flex-start;
          flex: 1;
          width: 100%;
        }

        .length-container {
          margin-top: 1rem;
          padding: 0;
        }
        .avatar-container {
          margin: 16px 0 0 16px;
        }

        .remove-img {
          position: relative;
        }

        img {
          border-radius: 10px;
          height: auto;
          width: 100%;
        }

        textarea {
          align-self: center;
          min-height: 120px;
          outline: 0;
          width: calc(100% - 30px);
          border: ${drag === DRAG_IMAGE_STATES.DRAG_OVER
            ? "3px dashed #09f"
            : "3px solid transparent"};
          border-radius: 10px;
          border: 1px solid ${colors.greyUnselected};
          padding: 15px;
          resize: none;
          font-size: 21px;
        }

        .error-length {
          font-size: 0.9rem;
          margin-bottom: 0;
          color: ${message.length >= 100 ? "#f4212e" : "#000"};
        }
      `}</style>
    </>
  );
}
