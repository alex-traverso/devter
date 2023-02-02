import { useState, useEffect } from "react";
import { colors } from "../../styles/theme";
import DevitComplete from "../../components/DevitComplete";
import Button from "../../components/Button";
import useUser from "../../hooks/useUser";
import { listenLatestDevits } from "../../firebase/client";
import { logOut } from "../../firebase/client";
import LogOut from "../../components/icons/LogOut";

//Recoil
import { useRecoilState } from "recoil";
import { modalState } from "../../atoms/modalAtom";
//Modal
import { Modal } from "../../components/Modal";
import Head from "next/head";
//Navbar
import Navbar from "../../components/Navbar";

const HomePage = () => {
  const [timeline, setTimeline] = useState([]);
  const user = useUser();

  const [isOpen, setIsOpen] = useRecoilState(modalState);
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
        <button onClick={logOut}>
          <LogOut fill={colors.white} />
          Cerrar sesión
        </button>
      </header>
      <section>
        {timeline.map(
          ({ userId, userName, avatar, content, createdAt, id, img }) => (
            <DevitComplete
              key={id}
              id={id}
              img={img}
              userName={userName}
              avatar={avatar}
              content={content}
              userId={userId}
              createdAt={createdAt}
              timeline={timeline}
            />
          )
        )}
        {isOpen && <Modal timeline={timeline} />}
      </section>
      <Navbar />

      <style jsx>
        {`
          header {
            display: flex;
            align-items: center;
            justify-content: space-between;
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

          button {
            background-color: ${colors.dark};
            color: ${colors.white};
            margin-right: 15px;
            border: 0;
            cursor: pointer;
            border-radius: 10rem;
            font-weight: 700;
            padding: 8px 24px;
            transition: all 0.3s ease;
            display: flex;
            user-select: none;
            align-items: center;
          }

          button > :global(svg) {
            margin-right: 8px;
          }

          button:hover {
            background-color: ${colors.red};
          }
        `}
      </style>
    </>
  );
};

export default HomePage;
