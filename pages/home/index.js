import { useState, useEffect } from "react";
import AppLayout from "../../components/AppLayout";
import Devit from "../../components/Devit";
import useUser from "../../hooks/useUser";

const HomePage = () => {
  const [timeline, setTimeline] = useState([]);
  const user = useUser();

  useEffect(() => {
    user &&
      fetch("http://localhost:3000/api/statuses/home_timeline")
        .then((res) => res.json())
        .then(setTimeline);
  }, [user]);

  return (
    <>
      <AppLayout>
        <header>
          <h2>Inicio</h2>
        </header>
        <section>
          {timeline.map(({ id, username, avatar, message }) => (
            <Devit
              key={id}
              username={username}
              avatar={avatar}
              message={message}
              id={id}
            />
          ))}
        </section>
        <nav></nav>
      </AppLayout>

      <style jsx>
        {`
          header {
            display: flex;
            align-items: center;
            top: 0;
            border-bottom: 1px solid #eee;
            background-color: #ffffffee;
            backdrop-filter: blur(3px);
            height: 49px;
            position: sticky;
            width: 100%;
          }

          h2 {
            font-weight: 800;
            padding-left: 15px;
          }

          nav {
            bottom: 0;
            left: 0;
            border-top: 1px solid #ccc;
            position: sticky;
            width: 100%;
            height: 3.5rem;
            background-color: #fff;
          }
        `}
      </style>
    </>
  );
};

export default HomePage;
