import { useState, Fragment, useEffect } from "react";
import Avatar from "../Avatar";
import { colors } from "../../styles/theme";
import useUser, { USER_STATES } from "../../hooks/useUser";

import {
  onSnapshot,
  doc,
  addDoc,
  collection,
  serverTimestamp,
} from "@firebase/firestore";
import { db } from "../../firebase/client";
import { useRecoilState } from "recoil";
import { modalState, postIdState } from "../../atoms/modalAtom";
import Router from "next/router";

export const Modal = () => {
  const user = useUser();

  const [isOpen, setIsOpen] = useRecoilState(modalState);
  const [postId, setPostId] = useRecoilState(postIdState);
  const [post, setPost] = useState();
  const [comment, setComment] = useState();

  useEffect(
    () =>
      onSnapshot(doc(db, "devits", postId), (snapshot) => {
        setPost(snapshot.data());
      }),
    [db]
  );

  const sendComment = async (e) => {
    e.preventDefault();

    await addDoc(collection(db, "devits", postId, "comments"), {
      comment: comment,
      userName: user.username,
      email: user.email,
      avatar: user.avatar,
      uid: user.uid,
    });
    setIsOpen(false);
    setComment("");
    Router.push(`/status/${postId}`);
  };

  return (
    <>
      <section>
        <div className='user-reply-container'>
          <Avatar src={post?.avatar} />
          <h4>{post?.userName}</h4>
        </div>
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
      </section>

      <style jsx>{`
        section {
          background-color: white;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
          position: absolute;
          top: 5rem;
          right: 1rem;
          border-radius: 10px;
          width: 90%;
          height: 40vh;
        }

        .user-reply-container {
          margin: 1rem;
          display: flex;
          gap: 1rem;
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
          min-height: 120px;
          width: 80%;
          outline: 0;
          border-radius: 10px;
          padding: 15px;
          resize: none;
          font-size: 18px;
        }
      `}</style>
    </>
  );
};
