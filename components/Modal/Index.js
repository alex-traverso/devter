import { useState, Fragment, useEffect } from "react";
import Avatar from "../Avatar";
import useUser from "../../hooks/useUser";
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
import Devit from "../Devit";

export const Modal = () => {
  const user = useUser();
  const [isOpen, setIsOpen] = useRecoilState(modalState);
  const [postId, setPostId] = useRecoilState(postIdState);
  return (
    <>
      <section>
        {/* <div>
          <Avatar src={user.avatar} alt={user.userName} />
          <button>Send</button>
        </div> */}
        {isOpen ? (
          <button
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
          background-color: #333;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
          position: absolute;
          top: 5rem;
          right: 0;
          border-radius: 10px;
          width: 90%;
          height: 50vh;
        }

        div {
          height: 50vh;
          width: 200px;
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

/* import { useRecoilState } from "recoil";
import { modalState, postIdState } from "../atoms/modalAtom";
import { Fragment, useEffect, useState } from "react";
import {
  onSnapshot,
  doc,
  addDoc,
  collection,
  serverTimestamp,
} from "@firebase/firestore";
import { db } from "../../firebase/client";

function Modal() {
  const [isOpen, setIsOpen] = useRecoilState(modalState);
  const [postId, setPostId] = useRecoilState(postIdState);
  const [post, setPost] = useState();
  const [comment, setComment] = useState("");

  useEffect(
    () =>
      onSnapshot(doc(db, "posts", postId), (snapshot) => {
        setPost(snapshot.data());
      }),
    [db]
  );

  const sendComment = async (e) => {
    e.preventDefault();

    await addDoc(collection(db, "posts", postId, "comments"), {
      comment: comment,
      username: session.user.name,
      tag: session.user.tag,
      userImg: session.user.image,
      timestamp: serverTimestamp(),
    });

    setIsOpen(false);
    setComment("");

    router.push(`/${postId}`);
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as='div' className='fixed z-50 inset-0 pt-8' onClose={setIsOpen}>
        <div className='flex items-start justify-center min-h-[800px] sm:min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <Dialog.Overlay className='fixed inset-0 bg-[#5b7083] bg-opacity-40 transition-opacity' />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            enterTo='opacity-100 translate-y-0 sm:scale-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100 translate-y-0 sm:scale-100'
            leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
          >
            <div className='inline-block align-bottom bg-black rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full'></div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export default Modal; */
