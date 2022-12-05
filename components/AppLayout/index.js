import { fonts, colors } from "../../styles/theme";

const AppLayout = ({children}) => {
    return (
        <>
            <div className="container">
            <main>
                {children}
            </main>
            </div>
            


            <style jsx>{`

                .container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    background-color: grey;
                }

                main { 
                background-color: white;
                height: 100vh;
                width: 100vw;
                display: flex;
                justify-content: center;
                align-items: center;
                }

                @media (min-width: 425px) {
                    main {
                        height: 90vh;
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