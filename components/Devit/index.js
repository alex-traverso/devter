import Avatar from "../../components/Avatar";
import { useTimeAgo } from "../../hooks/useTimeAgo";
import useDateTimeFormat from "../../hooks/useDateTimeFormat";
import Link from "next/link";
import Router from "next/router";
import Like from "../Icons/Like";
import Reply from "../Icons/Reply";

export default function Devit({
  id,
  avatar,
  userName,
  content,
  createdAt,
  img,
  likesCount,
}) {
  const timeAgo = useTimeAgo(createdAt);
  const createdAtFormated = useDateTimeFormat(createdAt);

  const handleArticleClick = (e) => {
    e.preventDefault();
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
          <div className='icon-container'>
            <div>
              <Reply width={25} height={25} />
              <Like width={25} height={25} fill='#AAB8C2' />
              <Like width={25} height={25} fill='#AAB8C2' value={likesCount} />
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
