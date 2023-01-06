import { useState, useEffect } from "react";
import Head from "next/head";
import useUser from "../../../hooks/useUser";
import { addDevit, uploadImage } from "../../../firebase/client";
import { getDownloadURL } from "firebase/storage";
import Button from "../../../components/Button";
import Avatar from "../../../components/Avatar";
//Router
import Router from "next/router";
import Navbar from "../../../components/Navbar";
import UploadImageIcon from "../../../components/Icons/UploadImageIcon";

const COMPOSE_STATES = {
  USER_NOT_KNOWN: 0,
  LOADING: 1,
  SUCCESS: 2,
  ERROR: -1,
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
      Router.push("/home");
    } catch (error) {
      console.error(err);
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
    message.length === 0 || status === COMPOSE_STATES.LOADING;

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
            onDrop={handleDrop}
            placeholder='¿Que está pasando?'
          ></textarea>
          <div className='upload-img-container'>
            <label
              for='file'
              onChange={(file) => {
                handleUpload(file);
              }}
            >
              <UploadImageIcon width='40' height='40' />
              <input id='file' type='file' />
            </label>
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
          border-radius: 999px;
        }

        .upload-img-container {
          display: flex;
        }

        input[type="file"]#file {
          width: 0.1px;
          height: 0.1px;
          opacity: 0;
          overflow: hidden;
          position: absolute;
          z-index: -1;
        }

        label[for="file"] {
          height: 35px;
          width: 35px;
        }

        .form-container {
          display: flex;
          align-items: flex-start;
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
          min-height: 150px;
          width: calc(100% - 30px);
          border: ${drag === DRAG_IMAGE_STATES.DRAG_OVER
            ? "3px dashed #09f"
            : "3px solid transparent"};
          outline: 0;
          border-radius: 10px;
          padding: 15px;
          resize: none;
          font-size: 21px;
        }
      `}</style>
    </>
  );
}
