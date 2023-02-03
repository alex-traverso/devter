import DevitComplete from "../../components/DevitComplete";
import Modal from "../../components/Modal/Index";
import Navbar from "../../components/Navbar";
import { useState, useEffect } from "react";

import { useRecoilState } from "recoil";
import { modalState, postIdState } from "../../atoms/modalAtom";

import { onSnapshot, collection, query } from "@firebase/firestore";
import { db } from "../../firebase/client";

export default function DevitPage(props) {
  const [postId, setPostId] = useRecoilState(postIdState);
  const [isOpen, setIsOpen] = useRecoilState(modalState);
  const [comments, setComments] = useState();

  useEffect(() => {
    //Obtener comentarios
    const obtainComments = () => {
      const querySnapshot = query(collection(db, "devits", postId, "comments"));

      onSnapshot(querySnapshot, ({ docs }) => {
        const newComments = docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          const { createdAt } = data;

          return {
            ...data,
            id,
            createdAt: +createdAt.toDate(),
          };
        });
        setComments(newComments);
      });
    };
    obtainComments();
  }, []);

  return (
    <>
      <DevitComplete {...props} />
      <>
        {comments === undefined ? null : (
          <>
            <div>{comments.length === 0 && null}</div>
            <div className='comments-container'>
              {comments.map(
                ({ userId, userName, avatar, content, createdAt, id }) => (
                  <DevitComplete
                    key={id}
                    id={id}
                    userName={userName}
                    avatar={avatar}
                    content={content}
                    userId={userId}
                    createdAt={createdAt}
                  />
                )
              )}
            </div>
          </>
        )}
      </>
      {isOpen && <Modal />}
      <Navbar />

      <style jsx>{`
        .comments-container {
          flex: 1;
        }

        .avatar-container {
          padding-right: 10px;
        }

        .comments {
          display: flex;
          gap: 8px;
          border-bottom: 2px solid #eee;
          padding: 10px 15px;
        }

        .comment {
          width: 100%;
          gap: 8px;
        }

        .comments:hover {
          background-color: #f5f8fa;
          cursor: pointer;
        }
      `}</style>
    </>
  );
}

//Data fetching usando getInitialProps
DevitPage.getInitialProps = async (context) => {
  const { query, res } = context;
  const { id } = query;

  return await fetch(`http://localhost:3000/api/devits/${id}`).then(
    (apiResponse) => {
      if (apiResponse.ok) return apiResponse.json();
      if (res) {
        res.writeHead(404).end();
        console.log(res);
      }
    }
  );
};
