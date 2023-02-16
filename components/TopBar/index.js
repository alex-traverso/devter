import useUser from "../../hooks/useUser";
import Avatar from "../Avatar";
import Loading from "../Loading";
import LogOut from "../Icons/LogOut";
import { logOut } from "../../firebase/client";
import { colors } from "../../styles/theme";

const TopBar = ({ title }) => {
  const user = useUser();

  return (
    <>
      <header>
        <h2>{title}</h2>
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
      <style jsx>{`
        header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          top: 0;
          z-index: 100;
          border-bottom: 1px solid #eee;
          background-color: #ffffff;
          backdrop-filter: blur(3px);
          height: 4rem;
          position: sticky;
          width: 100%;
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
      `}</style>
    </>
  );
};

export default TopBar;
