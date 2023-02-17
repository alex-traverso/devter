import { useState, useEffect } from "react";
import DevitComplete from "../../components/DevitComplete";
import useUser from "../../hooks/useUser";
import { listenLatestDevits } from "../../firebase/client";
import ComposeHome from "../../components/ComposeHome";
import TopBar from "../../components/TopBar";

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

  const [searchOpen, setSearchOpen] = useState(false);

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
      <TopBar title='Inicio' />
      <div>
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
          section {
            flex: 1;
          }
        `}
      </style>
    </>
  );
};

export default HomePage;
