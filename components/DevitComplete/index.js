import Devit from "../Devit";
import Interactions from "../Interactions";

const DevitComplete = ({
  userId,
  userName,
  avatar,
  content,
  createdAt,
  id,
  img,
}) => {
  return (
    <>
      <div>
        <Devit
          key={id}
          id={id}
          img={img}
          userName={userName}
          avatar={avatar}
          content={content}
          userId={userId}
          createdAt={createdAt}
        />
        <Interactions id={id} />
      </div>

      <style jsx>{`
        div {
          border-bottom: 2px solid #eee;
        }

        div:hover {
          background-color: #f5f8fa;
          cursor: pointer;
        }
      `}</style>
    </>
  );
};

export default DevitComplete;
