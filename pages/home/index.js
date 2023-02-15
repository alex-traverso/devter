import { useState, useEffect } from "react";
import { colors } from "../../styles/theme";
import DevitComplete from "../../components/DevitComplete";
import LogOut from "../../components/Icons/LogOut";
import Avatar from "../../components/Avatar";
import useUser from "../../hooks/useUser";
import { listenLatestDevits } from "../../firebase/client";
import { logOut } from "../../firebase/client";
import Loading from "../../components/Loading";
import UploadImageIcon from "../../components/Icons/UploadImageIcon";
import Emoji from "../../components/Icons/EmojiIcon";
import ComposeHome from "../../components/ComposeHome";

//Recoil
import { useRecoilState } from "recoil";
import { modalState } from "../../atoms/modalAtom";
//Modal
import Modal from "../../components/Modal/Index";
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
        <div>
          {user ? (
            <Avatar src={user.avatar} alt={user.displayName} />
          ) : (
            <Loading />
          )}
          <button onClick={logOut}>
            <LogOut stroke={colors.white} height={25} width={25} />
          </button>
        </div>
      </header>
      <div className='compose-container'>
        <ComposeHome />
      </div>
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
            height: 4rem;
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

          div {
            display: flex;
            align-items: center;
            height: auto;
            gap: 0.5rem;
          }

          button {
            background-color: ${colors.dark};
            color: ${colors.white};
            margin-right: 15px;
            border: 0;
            cursor: pointer;
            border-radius: 10rem;
            font-weight: 700;
            padding: 8px 20px;
            width: 4.2rem;
            height: 2.6rem;
            transition: all 0.3s ease;
            display: flex;
            user-select: none;
            align-items: center;
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
