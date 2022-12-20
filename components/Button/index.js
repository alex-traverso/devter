import { colors } from "../../styles/theme";

export default function Button({ children, onClick, disabled }) {
  return (
    <>
      <button onClick={onClick} disabled={disabled}>
        {children}
      </button>

      <style jsx>{`
        button {
          background-color: ${colors.dark};
          color: ${colors.white};
          border: 0;
          cursor: pointer;
          border-radius: 10rem;
          font-weight: 700;
          padding: 8px 24px;
          transition: opacity 0.3s ease;
          display: flex;
          user-select: none;
          align-items: center;
        }

        button[disabled] {
          pointer-events: none;
          opacity: 0.2;
        }

        button > :global(svg) {
          margin-right: 8px;
        }

        button:hover {
          opacity: 0.9;
        }
      `}</style>
    </>
  );
}
