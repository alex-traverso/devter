import { useState, useEffect } from "react";

import Router from "next/router";

//Recoil
import { useRecoilState } from "recoil";
import { modalState, postIdState } from "../../atoms/modalAtom";
//Iconos
import Like from "../Icons/Like";
import Reply from "../Icons/Reply";
import Delete from "../Icons/Delete";

import {
  doc,
  deleteDoc,
  setDoc,
  updateDoc,
  collection,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase/client";
import useUser from "../../hooks/useUser";
import { listenLatestDevits } from "../../firebase/client";

const Interactions = ({ id }) => {
  const user = useUser();
  const [likes, setLikes] = useState([]);
  const [hasLiked, setHasLiked] = useState(false);

  const [isOpen, setIsOpen] = useRecoilState(modalState);
  const [postId, setPostId] = useRecoilState(postIdState);
  const [comments, setComments] = useState([]);

  //Arreglar, al clickear hay un error en firebase por la coleccion de comments
  /* const handleClickPost = (e) => {
    Router.push(`/status/${id}`);
  }; */

  const handleDelete = (e) => {
    e.stopPropagation();
    listenLatestDevits((newDevits) => {
      newDevits.findIndex((newDevits) => newDevits.id === user.uid);
      deleteDoc(doc(db, "devits", id));
      Router.push("/");
    });
  };

  const handleReply = (e) => {
    e.stopPropagation();
    setPostId(id);
    setIsOpen(true);
  };

  useEffect(() => {
    onSnapshot(collection(db, "devits", id, "likes"), (snapshot) => {
      setLikes(snapshot.docs);
    });
  }, [id]);

  useEffect(() => {
    setHasLiked(likes.findIndex((like) => like.id === user.uid) !== -1);
  }, [likes]);

  const likePost = async (e) => {
    e.stopPropagation();
    const devitLiked = doc(db, "devits", id, "likes", user.uid);
    if (hasLiked) {
      await deleteDoc(devitLiked);
    } else {
      await setDoc(doc(db, "devits", id, "likes", user.uid), {
        username: user.username,
      });
    }
  };

  return (
    <>
      <div className='icon-container'>
        <div>
          <div className='comments-count-container'>
            <Reply width={25} height={25} onClick={handleReply} />
            {comments.length > 0 ? <span>{comments.length}</span> : null}
            {/* {comments.length > 0 ? (
                  <>
                    <Reply width={25} height={25} onClick={handleReply} />
                    <span>{comments.length}</span>
                  </>
                ) : (
                  <Reply width={25} height={25} onClick={handleReply} />
                )} */}
          </div>

          <Delete
            width={25}
            height={25}
            fill='#AAB8C2'
            onClick={handleDelete}
          />
          <div className='like-count-container'>
            {likes.length > 0 ? (
              <>
                <Like
                  width={25}
                  height={25}
                  fill='#E72A4B'
                  onClick={likePost}
                />
                <span className='like-text'>{likes.length}</span>
              </>
            ) : (
              <Like width={25} height={25} fill='#AAB8C2' onClick={likePost} />
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .icon-container {
          display: flex;
          justify-content: right;
          padding: 0.5rem 0 1rem 0;
        }

        .icon-container > div {
          display: flex;
          justify-content: space-around;
          width: 100%;
        }

        .comments-count-container,
        .like-count-container {
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }
        .like-text {
          color: #e72a4b;
        }
      `}</style>
    </>
  );
};

export default Interactions;
