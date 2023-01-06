import Avatar from "../../components/Avatar";
import { useTimeAgo } from "../../hooks/useTimeAgo";
import useDateTimeFormat from "../../hooks/useDateTimeFormat";
import Link from "next/link";
import Router from "next/router";
import { addLike, likePost } from "../../firebase/client";
import { useState, useEffect } from "react";

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

  const handleArticleClick = (e) => {
    e.preventDefault();
    Router.push(`/status/${id}`);
  };

  const handleDelete = () => {
    listenLatestDevits((newDevits) => {
      newDevits.findIndex((newDevits) => newDevits.id === user.uid);
      deleteDoc(doc(db, "devits", id));
      Router.push("/");
    });
  };

  useEffect(() => {
    onSnapshot(collection(db, "devits", id, "likes"), (snapshot) => {
      setLikes(snapshot.docs);
    });
  }, [id]);

  useEffect(() => {
    setHasLiked(likes.findIndex((like) => like.id === user.uid) !== -1);
  }, [likes]);

  const likePost = async () => {
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
              <Reply width={25} height={25} />
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
