import { colors } from "../../styles/theme";

export default function Loading({ size }) {
  return (
    <>
      <div className='loading-container'>
        <div className='loading'></div>
      </div>
      <style jsx>
        {`
          .loading-container {
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .loading {
            border: 4px solid #f3f3f3;
            border-radius: 50%;
            border-top: 4px solid ${colors.secondary};
            width: ${size}px;
            height: ${size}px;
            animation: spin 0.7s linear infinite;
          }
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </>
  );
}
