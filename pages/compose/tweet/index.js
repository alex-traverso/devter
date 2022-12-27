import { useState, useEffect } from "react";
import AppLayout from "../../../components/AppLayout";
import Button from "../../../components/Button";
import Avatar from "../../../components/Avatar";
import useUser from "../../../hooks/useUser";
import { addDevit, uploadImage } from "../../../firebase/client";
import Head from "next/head";
import { getDownloadURL } from "firebase/storage";
//Router
import Router from "next/router";

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
      // Listen for state changes, errors, and completion of the upload.
      //Progreso
      task.on(
        "state_changed",
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
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
          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
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
          // Upload completed successfully, now we can get the download URL
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
      userId: user.uid,
      userName: user.username,
      img: imgURL,
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
    console.log(file);
    const task = uploadImage(file);
    setTask(task);
  };

  const isButtonDisabled =
    message.length === 0 || status === COMPOSE_STATES.LOADING;

  return (
    <>
      <AppLayout>
        <Head>
          <title>Crear un Devit / Devter</title>
        </Head>
        <form onSubmit={handleSubmit}>
          <textarea
            onChange={handleChange}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            placeholder='¿Que está pasando?'
          ></textarea>
          {imgURL ? (
            <section>
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
      </AppLayout>

      <style jsx>{`
        div {
          padding: 15px;
        }

        form {
          margin: 10px;
          display: flex;
          flex-direction: column;
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

        section {
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
