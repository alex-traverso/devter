import Avatar from "../../components/Avatar";
import { useTimeAgo } from "../../hooks/useTimeAgo";
import useDateTimeFormat from "../../hooks/useDateTimeFormat";
import Link from "next/link";
import Router from "next/router";
import { useState } from "react";

//Recoil
import { useRecoilState } from "recoil";
import { modalState, postIdState } from "../../atoms/modalAtom";

import useUser from "../../hooks/useUser";

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

  const [postId, setPostId] = useRecoilState(postIdState);

  const handleArticleClick = (e) => {
    e.preventDefault();
    setPostId(id);
    Router.push(`/status/${id}`);
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
        </section>
      </article>

      <style jsx>{`
        article {
          display: flex;
          padding: 10px 15px;
        }

        article:hover {
          background-color: #f5f8fa;
          cursor: pointer;
          border-radius: inherit;
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

        img {
          border-radius: 10px;
          margin-top: 10px;
          height: auto;
          width: 100%;
        }
      `}</style>
    </>
  );
}
