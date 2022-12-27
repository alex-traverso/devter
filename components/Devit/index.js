import Avatar from "../../components/Avatar";
import { useTimeAgo } from "../../hooks/useTimeAgo";

export default function Devit({
  id,
  avatar,
  userName,
  content,
  createdAt,
  img,
}) {
  const timeAgo = useTimeAgo(createdAt);
  return (
    <>
      <article>
        <div>
          <Avatar src={avatar} alt={userName} />
        </div>

        <section>
          <strong>{userName}</strong>
          <span> . </span>
          <date>{timeAgo}</date>
          <p>{content}</p>
          {img ? <img src={img} alt={userName} /> : null}
        </section>
      </article>

      <style jsx>{`
        article {
          display: flex;
          padding: 10px 15px;
          border-bottom: 2px solid #eee;
        }

        div {
          padding-right: 10px;
        }

        date {
          color: #555;
          font-size: 14px;
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
