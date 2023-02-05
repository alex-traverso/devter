import { useState, useEffect } from "react";
import Avatar from "../Avatar";
import Devit from "../Devit";
import { colors } from "../../styles/theme";
import useUser from "../../hooks/useUser";
import Loading from "../Loading";
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

const Modal = () => {
  const user = useUser();

  const [isOpen, setIsOpen] = useRecoilState(modalState);
  const [postId, setPostId] = useRecoilState(postIdState);
  const [post, setPost] = useState([]);
  const [comment, setComment] = useState();

  const [clickedPost, setClickedPost] = useState();

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
            <textarea
              value={comment}
              onChange={(e) => {
                setComment(e.target.value);
              }}
              placeholder='Escribe tu respuesta'
            ></textarea>
          </div>
          <div className='btn-reply-container'>
            <button className='btn-reply' onClick={sendComment}>
              Enviar
            </button>
          </div>
          {isOpen ? (
            <button
              className='btn-close-modal'
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
          width: 450px;
          min-height: 45vh;
          -webkit-animation: fadein 0.3s;
          animation: fadein 0.3s;
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
          align-items: flex-start;
          gap: 1rem;
        }

        .btn-close-modal {
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
          margin-bottom: 1rem;
          min-height: 120px;
          width: 80%;
          resize: none;
          outline: none;
          padding: 15px;
          font-size: 18px;
          border: 1px solid ${colors.greyUnselected};
          border-radius: 10px;
        }

        .img-link {
          font-size: 0.8rem;
          width: 100%;
        }
      `}</style>
    </>
  ) : (
    <Loading width={30} height={30} />
  );
};

export default Modal;
