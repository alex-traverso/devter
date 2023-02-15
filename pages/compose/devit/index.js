import { useState, useEffect } from "react";
import { colors } from "../../../styles/theme";
import Head from "next/head";
import useUser from "../../../hooks/useUser";
import { addDevit, uploadImage } from "../../../firebase/client";
import { getDownloadURL } from "firebase/storage";
import Button from "../../../components/Button";
import Avatar from "../../../components/Avatar";
//Iconos
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

//Router
import Router from "next/router";
import Navbar from "../../../components/Navbar";
import UploadImageIcon from "../../../components/Icons/UploadImageIcon";
import EmojiIcon from "../../../components/Icons/EmojiIcon";

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

export default function ComposeTweet() {
  const user = useUser();
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(COMPOSE_STATES.USER_NOT_KNOWN);

  //estados para subir imagenes
  const [drag, setDrag] = useState(COMPOSE_STATES.NONE);
  const [task, setTask] = useState(null);
  const [imgURL, setImgURL] = useState(null);

  //iconos
  const [inputStr, setInputStr] = useState();
  const [showPicker, setShowPicker] = useState(false);

  console.log(inputStr);

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

  //ARREGLAR, QUE SE MUESTRE EL EMOJI EN LA PANTALLA
  //AGREGAR CONTADOR DE CARACTERES
  const handleChange = (e) => {
    const { value } = e.target;
    if (value.length >= 140) {
      setStatus(COMPOSE_STATES.ERROR_LENGTH);
    } else {
      setStatus(COMPOSE_STATES.NONE);
    }
    setMessage(value);
    setInputStr(value);
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
      Router.push("/home");
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
      <Head>
        <title>Crear un Devit / Devter</title>
      </Head>
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
            value={message}
            onDrop={handleDrop}
            placeholder='¿Que está pasando?'
          ></textarea>
          {status === COMPOSE_STATES.ERROR_LENGTH ? (
            <p className='error-length'>El máximo de caracteres es de 140</p>
          ) : null}
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
            {showPicker && (
              <Picker data={data} onEmojiSelect={addEmoji} theme='light' />
            )}
          </div>

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
          <div>
            <Button disabled={isButtonDisabled}>Devittear</Button>
          </div>
        </form>
      </section>
      <Navbar />

      <style jsx>{`
        div {
          padding: 15px;
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
          border-top: 1px solid ${colors.greyUnselected};
          border-bottom: 1px solid ${colors.greyUnselected};
          margin-top: 12px;
          padding: 7px 0;
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
          color: #f4212e;
        }
      `}</style>
    </>
  );
}
