import { useState, useEffect } from "react";
import Devit from "../../components/Devit";
import useUser from "../../hooks/useUser";
import { fetchLatestDevits, listenLatestDevits } from "../../firebase/client";

import Head from "next/head";
//Navbar
import Navbar from "../../components/Navbar";

const HomePage = () => {
  const [timeline, setTimeline] = useState([]);
  const user = useUser();

  useEffect(() => {
    let unsubscribe;
    if (user) {
      unsubscribe = listenLatestDevits((newDevit) => {
        setTimeline(newDevit);
      });
    }
    return () => unsubscribe && unsubscribe();
  }, [user]);

  return (
    <>
      <Head>
        <title>Inicio / Devter</title>
      </Head>
      <header>
        <h2>Inicio</h2>
      </header>
      <section>
        {timeline.map(
          ({
            userId,
            userName,
            avatar,
            content,
            createdAt,
            id,
            img,
            likesCount,
          }) => (
            <Devit
              key={id}
              id={id}
              img={img}
              userName={userName}
              avatar={avatar}
              content={content}
              userId={userId}
              createdAt={createdAt}
              likesCount={likesCount}
            />
          )
        )}
      </section>
      <Navbar />

      <style jsx>
        {`
          header {
            display: flex;
            align-items: center;
            top: 0;
            border-bottom: 1px solid #eee;
            background-color: #ffffffee;
            backdrop-filter: blur(3px);
            height: 3.75rem;
            position: sticky;
            width: 100%;
          }

          section {
            flex: 1;
          }

          h2 {
            font-weight: 800;
            padding-left: 15px;
          }
        `}
      </style>
    </>
  );
};

export default HomePage;
