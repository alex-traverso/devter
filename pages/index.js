import { useEffect } from "react";
import Head from "next/head";
import Button from "../components/Button";
import GitHub from "../components/Icons/Github";
import GoogleIcon from "../components/Icons/GoogleIcon";
import Logo from "../components/Icons/Logo";
import Avatar from "../components/Avatar";
import { colors } from "../styles/theme";
import Loading from "../components/Loading";
//  Firebase Client
import { loginWithGithub } from "/firebase/client.js";
import { loginWithGoogle } from "../firebase/client";
//Hook useUser
import useUser, { USER_STATES } from "../hooks/useUser";
//Router
import Router from "next/router";

export default function Home() {
  const user = useUser();
  useEffect(() => {
    user && Router.replace("/home");
  }, [user]);

  const logInGithub = () => {
    loginWithGithub().catch((err) => {
      console.log(err);
    });
  };

  const logInGoogle = () => {
    loginWithGoogle().catch((err) => {
      console.log(err);
    });
  };

  return (
    <div>
      <Head>
        <title>Devter</title>
        <meta name='description' content='Generated by create next app' />
        <link rel='shortcut icon' href='../public/favicon.ico' />
      </Head>

      <section>
        <Logo alt='logo' height={90} />
        <h1>Devter</h1>
        <h2>
          Talk about development <br></br>with developers
        </h2>
        <div>
          {user === USER_STATES.NOT_LOGGED && (
            <div className='buttons-container'>
              <Button onClick={logInGithub}>
                <GitHub width={24} height={24} fill={"#fff"} />
                Login with Github
              </Button>
              <Button onClick={logInGoogle}>
                <GoogleIcon width={24} height={24} fill={"#fff"} />
                Login with Google
              </Button>
            </div>
          )}

          {user && user.avatar && (
            <div className='avatar-loading-container'>
              <Avatar alt={user.name} src={user.avatar} text={user.name} />
              <Loading width={50} height={50} />
            </div>
          )}

          {user === USER_STATES.NOT_KNOWN && <Loading width={30} height={30} />}
        </div>
      </section>

      <style jsx>{`
        img {
          height: 60px;
        }

        div {
          height: 100%;
        }

        section {
          display: grid;
          height: 100%;
          place-content: center;
          place-items: center;
        }

        h1 {
          color: ${colors.primary};
          font-size: 2rem;
          margin-bottom: 0;
        }

        h2 {
          color: ${colors.secondary};
          font-size: 1.3rem;
          text-align: center;
        }

        .buttons-container {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .avatar-loading-container {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
      `}</style>
    </div>
  );
}
