import Avatar from "../../components/Avatar";
import { useTimeAgo } from "../../hooks/useTimeAgo";
import useDateTimeFormat from "../../hooks/useDateTimeFormat";
import Link from "next/link";
import Router from "next/router";
import { useState, useEffect } from "react";

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

export default function Devit({
  id,
  avatar,
  userName,
  content,
  createdAt,
  img,
}) {
  const timeAgo = useTimeAgo(createdAt);
  const createdAtFormated = useDateTimeFormat(createdAt);
  const user = useUser();
  const [likes, setLikes] = useState([]);
  const [hasLiked, setHasLiked] = useState(false);

  const [isOpen, setIsOpen] = useRecoilState(modalState);
  const [postId, setPostId] = useRecoilState(postIdState);
  const [comments, setComments] = useState([]);

  const handleArticleClick = (e) => {
    e.preventDefault();
    Router.push(`/status/${id}`);
  };

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
    console.log("handleReply isOpen " + isOpen);
    setIsOpen(true);
    console.log(e);
    console.log("handleReply isOpen " + isOpen);
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
      <article onClick={handleArticleClick}>
        <div className='avatar-container'>
          <Avatar src={avatar} alt={userName} />
        </div>
        <section>
          <strong>{userName}</strong>
          <span> . </span>
          <Link href={`/status/${id}`}>
            <time title={createdAtFormated}>{timeAgo}</time>
          </Link>
          <p>{content}</p>
          {img ? <img src={img} alt={userName} /> : null}
          <div className='icon-container'>
            <div>
              <div className='comments-count-container'>
                <Reply width={25} height={25} onClick={handleReply} />
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
                  <Like
                    width={25}
                    height={25}
                    fill='#AAB8C2'
                    onClick={likePost}
                  />
                )}
              </div>
            </div>
          </div>
        </section>
      </article>
      {/* {showModal ? <Modal /> : null} */}

      <style jsx>{`
        article {
          display: flex;
          padding: 10px 15px;
          border-bottom: 2px solid #eee;
        }

        article:hover {
          background-color: #f5f8fa;
          cursor: pointer;
        }

        section {
          width: 100%;
        }

        .avatar-container {
          padding-right: 10px;
        }

        time {
          color: #555;
          font-size: 14px;
          text-decoration: none;
        }

        time:hover {
          text-decoration: underline;
        }

        p {
          line-height: 1.3125;
          margin: 0;
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

        img {
          border-radius: 10px;
          margin-top: 10px;
          height: auto;
          width: 100%;
        }

        .icon-container {
          display: flex;
          justify-content: right;
          margin-top: 1rem;
        }

        .icon-container > div {
          display: flex;
          justify-content: space-around;
          width: 100%;
        }
      `}</style>
    </>
  );
}
