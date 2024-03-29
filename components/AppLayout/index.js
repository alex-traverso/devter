import { fonts, colors } from "../../styles/theme";

const AppLayout = ({ children }) => {
  return (
    <>
      <div>
        <main>{children}</main>
      </div>

      <style jsx>
        {`
          div {
            display: grid;
            place-items: center;
            height: 100vh;
            background-color: ${colors.grey};
          }

          main {
            background-color: white;
            height: 100%;
            width: 100%;
            border-radius: 10px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            position: relative;
          }

          @media (min-width: 425px) {
            main {
              height: 95vh;
              width: 400px;
            }
          }

          @media (min-width: 768px) {
            main {
              width: 600px;
            }
          }
        `}
      </style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          box-sizing: border-box;
          font-family: ${fonts.base};
          overfloy: hidden;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        textarea,
        input {
          font-family: ${fonts.base};
        }
      `}</style>
    </>
  );
};

export default AppLayout;
