import Avatar from "../../components/Avatar";

export default function Devit({ id, avatar, userName, content }) {
  return (
    <>
      <article>
        <div>
          <Avatar src={avatar} alt={userName} />
        </div>

        <section>
          <strong>{userName}</strong>
          <p>{content}</p>
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

        p {
          line-height: 1.3125;
          margin: 0;
        }
      `}</style>
    </>
  );
}
