import { fonts, colors } from "../../styles/theme";

const AppLayout = ({children}) => {
    return (
        <>
            <div>
            <main>
                {children}
            </main>
            </div>
            

            <style jsx>{`

                div {
                    display: grid;
                    place-items: center;
                    height: 100vh;
                    background-color: ${colors.primary};
                }

                main { 
                background-color: white;
                padding: 1.5rem;
                height: 100vh;
                width: 100vw;
                border-radius: 10px;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
                
                }

                @media (min-width: 425px) {
                    main {
                        height: 90vh;
                        width: 500px;

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
            }

            a {
                color: inherit;
                text-decoration: none;
            }

            `}</style>
        </>
    
)
}

export default AppLayout;