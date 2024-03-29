import { useState, useEffect } from "react";
import { colors } from "../../styles/theme";
import Router from "next/router";

//Recoil
import { useRecoilState } from "recoil";
import { modalState, postIdState } from "../../atoms/modalAtom";
//Iconos
import Like from "../Icons/Like";
import Reply from "../Icons/Reply";
import Delete from "../Icons/Delete";
import Retweet from "../Icons/Retweet";

import {
  doc,
  deleteDoc,
  setDoc,
  collection,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase/client";
import useUser from "../../hooks/useUser";

const Interactions = ({ id, userId }) => {
  const user = useUser();
  const [likes, setLikes] = useState([]);
  const [hasLiked, setHasLiked] = useState(false);
  const [shares, setShares] = useState([]);
  const [hasShared, setHasShared] = useState(false);

  const [isOpen, setIsOpen] = useRecoilState(modalState);
  const [postId, setPostId] = useRecoilState(postIdState);
  const [comments, setComments] = useState([]);

  //Identifica si el creador del devit esta logeado
  const isCreator = () => {
    if (user) {
      if (user.uid === userId) {
        return true;
      }
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    deleteDoc(doc(db, "devits", id));
    Router.push("/");
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
        userId: user.uid,
      });
    }
  };

  useEffect(() => {
    onSnapshot(collection(db, "devits", id, "shares"), (snapshot) => {
      setShares(snapshot.docs);
    });
  }, [id]);

  useEffect(() => {
    setHasShared(shares.findIndex((like) => like.id === user.uid) !== -1);
  }, [shares]);

  const sharePost = async (e) => {
    e.stopPropagation();
    const devitShared = doc(db, "devits", id, "shares", user.uid);
    if (hasShared) {
      await deleteDoc(devitShared);
    } else {
      await setDoc(devitShared, {
        username: user.username,
        userId: user.uid,
      });
    }
  };

  useEffect(() => {
    onSnapshot(collection(db, "devits", id, "comments"), (snapshot) => {
      setComments(snapshot.docs);
    });
  }, [id]);

  return (
    <>
      <div className='icon-container'>
        <div>
          <div className='interactions-count-container'>
            {comments.length > 0 ? (
              <>
                <Reply
                  fill={colors.greyUnselected}
                  width={18}
                  height={18}
                  onClick={handleReply}
                />
                <span className='comments-text'>{comments.length}</span>
              </>
            ) : (
              <Reply
                fill={colors.greyUnselected}
                width={18}
                height={18}
                onClick={handleReply}
              />
            )}
          </div>

          <div className='interactions-count-container'>
            {isCreator() ? (
              <Delete
                stroke={colors.greyUnselected}
                width={18}
                height={18}
                onClick={handleDelete}
              />
            ) : shares.length > 0 ? (
              <>
                <Retweet
                  fill={hasShared ? colors.green : colors.greyUnselected}
                  width={18}
                  height={18}
                  onClick={sharePost}
                />
                <span className='shares-text'>{shares.length}</span>
              </>
            ) : (
              <Retweet
                fill={colors.greyUnselected}
                width={18}
                height={18}
                onClick={sharePost}
              />
            )}
          </div>

          <div className='interactions-count-container'>
            {likes.length > 0 ? (
              <>
                <Like
                  width={18}
                  height={18}
                  fill={hasLiked ? colors.red : "none"}
                  stroke={hasLiked ? colors.red : colors.greyUnselected}
                  onClick={likePost}
                />
                <span className='like-text'>{likes.length}</span>
              </>
            ) : (
              <Like
                width={18}
                height={18}
                stroke={colors.greyUnselected}
                fill='none'
                onClick={likePost}
              />
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

        .interactions-count-container {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          width: 2rem;
        }

        .comments-text {
          color: ${colors.greyUnselected};
        }
        .like-text {
          color: ${hasLiked ? colors.red : colors.greyUnselected};
        }
        .shares-text {
          color: ${hasShared ? colors.green : colors.greyUnselected};
        }
      `}</style>
    </>
  );
};

export default Interactions;
