import Devit from "../Devit";
import CommentInteractions from "../CommentInteractions";
import Router from "next/router";
//Recoil
import { useRecoilState } from "recoil";
import { postIdState } from "../../atoms/modalAtom";

const DevitInteractions = ({
  userId,
  userName,
  avatar,
  content,
  createdAt,
  id,
  img,
}) => {
  const [postId, setPostId] = useRecoilState(postIdState);

  const handleArticleClick = (e) => {
    e.preventDefault();
    setPostId(id);
  };

  return (
    <>
      <div onClick={handleArticleClick}>
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
        <CommentInteractions id={id} userId={userId} />
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

export default DevitInteractions;
