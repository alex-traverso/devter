import Devit from "../../components/Devit";
import Navbar from "../../components/Navbar";
import { useState, useEffect } from "react";
import Avatar from "../../components/Avatar";

import { useRecoilState } from "recoil";
import { modalState, postIdState } from "../../atoms/modalAtom";

import { useTimeAgo } from "../../hooks/useTimeAgo";

import { onSnapshot, doc, collection, query } from "@firebase/firestore";
import { db } from "../../firebase/client";

export default function DevitPage(props) {
  const [postId, setPostId] = useRecoilState(postIdState);
  const [comments, setComments] = useState();

  /* const timeAgo = useTimeAgo(comments ? comments.createdAt : 0); */

  useEffect(() => {
    //Obtener productos
    const obtainComments = () => {
      const querySnapshot = query(collection(db, "devits", postId, "comments"));

      onSnapshot(querySnapshot, ({ docs }) => {
        const newComments = docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;

          return {
            ...data,
            id,
          };
        });
        setComments(newComments);
      });
    };
    obtainComments();
  }, []);

  console.log(comments);
  console.log(postId);

  return (
    <>
      <Devit {...props} />
      <>
        {comments === undefined ? null : (
          <>
            <div>{comments.length === 0 && null}</div>
            <div className='comments-container'>
              {comments.map((comment, i) => (
                <article className='comments' key={`${comment.uid}-${i}`}>
                  <div className='avatar-container'>
                    <Avatar src={comment.avatar} alt={comment.userName} />
                  </div>
                  <section className='comment'>
                    <strong>{comment.userName}</strong>
                    <span> . </span>
                    <p>{comment.comment}</p>
                  </section>
                </article>
              ))}
            </div>
          </>
        )}
      </>
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
      }
    }
  );
};
