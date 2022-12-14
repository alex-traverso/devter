import Avatar from "../../components/Avatar";

export default function Devit({ id, avatar, username, message }) {
  return (
    <>
      <article>
        <div>
          <Avatar src={avatar} alt={username} />
        </div>

        <section>
          <strong>{username}</strong>
          <p>{message}</p>
        </section>
      </article>

      <style jsx>{`
        article {
          display: flex;
          padding: 10px 15px;
        }

        div {
          padding-right: 10px;
        }

        p {
          margin: 0;
        }
      `}</style>
    </>
  );
}
