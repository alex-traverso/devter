import { useState, useEffect } from "react";
import Head from "next/head";
import Avatar from "../Avatar";
import Devit from "../Devit";
import { colors } from "../../styles/theme";
import useUser from "../../hooks/useUser";
import dynamic from "next/dynamic";
import Loading from "../Loading";
import { addDevit, uploadImage } from "../../firebase/client";
import { getDownloadURL } from "firebase/storage";
import {
  onSnapshot,
  addDoc,
  query,
  collection,
  Timestamp,
} from "@firebase/firestore";
import { db } from "../../firebase/client";
import { useRecoilState } from "recoil";
import { modalState, postIdState } from "../../atoms/modalAtom";
import Router from "next/router";
import UploadImageIcon from "../Icons/UploadImageIcon";
import EmojiIcon from "../Icons/EmojiIcon";
import LenghtCount from "../LengthCount";

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

const Modal = () => {
  const Picker = dynamic(
    () => {
      return import("emoji-picker-react");
    },
    { ssr: false }
  );

  const user = useUser();

  const [isOpen, setIsOpen] = useRecoilState(modalState);
  const [postId, setPostId] = useRecoilState(postIdState);
  const [post, setPost] = useState([]);
  const [comment, setComment] = useState("");

  const [clickedPost, setClickedPost] = useState();
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
    setComment(value);
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
    (comment.length === 0 && !imgURL) ||
    status === COMPOSE_STATES.LOADING ||
    status === COMPOSE_STATES.ERROR_LENGTH;

  const addEmoji = (e) => {
    let sym = e.unified.split("-");
    let codesArray = [];
    sym.forEach((el) => codesArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codesArray);
    setComment(comment + emoji);
  };

  useEffect(() => {
    //Obtener comentarios
    const obtainDevit = () => {
      const querySnapshot = query(collection(db, "devits"));
      onSnapshot(querySnapshot, ({ docs }) => {
        const clickedPost = docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          const { createdAt } = data;

          return {
            ...data,
            id,
            createdAt: +createdAt.toDate(),
          };
        });
        setPost(clickedPost);
      });
    };
    obtainDevit();
  }, []);

  useEffect(() => {
    post.map((clickedPost) => {
      if (clickedPost.id === postId) {
        setClickedPost(clickedPost);
      }
    });
  }, [post]);

  const sendComment = async (e) => {
    e.preventDefault();

    await addDoc(collection(db, "devits", postId, "comments"), {
      content: comment,
      userName: user.username,
      img: imgURL,
      email: user.email,
      avatar: user.avatar,
      userId: user.uid,
      createdAt: Timestamp.fromDate(new Date()),
    });
    setIsOpen(false);
    setComment("");
    Router.push(`/status/${postId}`);
  };

  return clickedPost ? (
    <>
      <Head>
        <title>Responde un Devit / Devter</title>
      </Head>
      <section>
        <div className='modal-container'>
          <Devit
            avatar={clickedPost.avatar}
            content={clickedPost.content}
            id={clickedPost.id}
            userName={clickedPost.userName}
            createdAt={clickedPost.createdAt}
          />

          <div className='reply-container'>
            {user && user.avatar && (
              <div>
                <Avatar alt={user.name} src={user.avatar} text={user.name} />
              </div>
            )}
            <div className='content-reply-container'>
              <textarea
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                value={comment}
                onChange={handleChange}
                placeholder='Escribe tu respuesta'
              ></textarea>

              <div className='img-icon-container'>
                <label
                  for='file'
                  onChange={(file) => {
                    handleUpload(file);
                  }}
                >
                  <UploadImageIcon
                    width={25}
                    height={25}
                    fill={colors.primary}
                  />
                  <input id='file' type='file' />
                </label>
                <EmojiIcon
                  width={25}
                  height={25}
                  fill={colors.primary}
                  onClick={() => setShowPicker((val) => !val)}
                />
                {comment ? (
                  <LenghtCount
                    height={25}
                    width={25}
                    strokeWidth={8}
                    percentage={comment.length}
                  />
                ) : null}
              </div>
              {showPicker && (
                <Picker onEmojiClick={addEmoji} height={300} width='240px' />
              )}
              {imgURL ? (
                <div className='remove-img'>
                  <button
                    className='btn-close'
                    onClick={() => {
                      setImgURL(null);
                    }}
                  >
                    X
                  </button>
                  <img src={imgURL}></img>
                </div>
              ) : null}
            </div>
          </div>
          <div className='btn-reply-container'>
            <button
              className='btn-reply'
              disabled={isButtonDisabled}
              onClick={sendComment}
            >
              Enviar
            </button>
          </div>
          {isOpen ? (
            <button
              className='btn-close'
              onClick={() => {
                setIsOpen(false);
              }}
            >
              X
            </button>
          ) : null}
        </div>
      </section>

      <style jsx>{`
        section {
          background-color: rgba(0, 0, 0, 0.5);
          position: fixed;
          top: 0;
          left: 0;
          z-index: 999;
          width: 100%;
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .modal-container {
          background-color: white;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
          position: relative;
          border-radius: 10px;
          width: 500px;
          min-height: 50vh;
          -webkit-animation: fadein 0.3s;
          animation: fadein 0.3s;
        }

        .img-icon-container {
          display: flex;
          justify-content: start;
          width: 100%;
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

        @keyframes fadein {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .reply-container {
          margin: 1rem;
          display: flex;
          gap: 1rem;
        }

        .content-reply-container {
          width: 100%;
        }

        .btn-close {
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

        button {
          cursor: pointer;
        }

        button[disabled] {
          pointer-events: none;
          background-color: #000;
          opacity: 0.2;
        }

        .btn-reply {
          padding: 0.5rem;
          width: 110px;
          border: none;
          color: white;
          font-size: 1rem;
          font-weight: 600;
          position: absolute;
          border-radius: 1rem;
          bottom: 1rem;
          right: 1rem;
          background-color: ${colors.primary};
        }

        h4 {
          font-size: 1rem;
        }

        .img-avatar {
          height: 30px;
        }

        textarea {
          align-self: center;
          min-height: 120px;
          width: 90%;
          resize: none;
          outline: none;
          padding: 15px;
          font-size: 18px;
          border: 1px solid ${colors.greyUnselected};
          border-radius: 10px;
        }

        .remove-img {
          position: relative;
          width: 120px;
          height: auto;
        }

        img {
          border-radius: 10px;
          max-width: 120px;
        }

        .img-link {
          font-size: 0.8rem;
          width: 100%;
        }

        .error-length {
          font-size: 0.9rem;
          margin-bottom: 0;
          color: ${comment.length >= 100 ? "#f4212e" : "#000"};
        }

        @media (min-width: 375px) {
          .modal-container {
            width: 340px;
          }
        }
        @media (min-width: 425px) {
          .modal-container {
            width: 360px;
          }
        }

        @media (min-width: 768px) {
          .modal-container {
            width: 500px;
          }
        }
      `}</style>
    </>
  ) : (
    <Loading width={30} height={30} />
  );
};

export default Modal;
