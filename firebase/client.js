import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GithubAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAFOrKjYNI2goIxpD_s7TqtzY7lLvrmPFs",
    authDomain: "devter-96289.firebaseapp.com",
    projectId: "devter-96289",
    storageBucket: "devter-96289.appspot.com",
    messagingSenderId: "379746049782",
    appId: "1:379746049782:web:b25d8c40221489baf556d7",
    measurementId: "G-YXELZ3LBCJ"
};

const app = initializeApp( firebaseConfig );

export const loginWithGithub = () => {
    const auth = getAuth();
    const githubProvider = new GithubAuthProvider();
    return signInWithPopup( auth, githubProvider ).then( ( user ) => {
        const { aditionalUserInfo } = user;
        const { displayName, profile } = aditionalUserInfo;
        const { avatar_url, blog } = profile;

        return {
            avatar: avatar_url,
            displayName,
            url: blog
            /* url: blog */
        }
    });
    }
    
    

export default app;
