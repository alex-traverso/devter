import { colors } from "../../styles/theme";

export default function Button( { children, onClick } ) {
    return (
        <>
            <button onClick={onClick}>
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
                transition: opacity .3s ease;
                display: flex;
                align-items: center;
            }

            button > :global(svg) {
                margin-right: 8px;
            }
            
            button:hover {
                opacity: .9;
            }


            `}</style>
        </>
    )
}