import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GithubAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAFOrKjYNI2goIxpD_s7TqtzY7lLvrmPFs",
  authDomain: "devter-96289.firebaseapp.com",
  projectId: "devter-96289",
  storageBucket: "devter-96289.appspot.com",
  messagingSenderId: "379746049782",
  appId: "1:379746049782:web:b25d8c40221489baf556d7",
  measurementId: "G-YXELZ3LBCJ",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();

const mapUserFromFirebaseAuth = (response) => {
  const user = response.user;
  const { displayName, email, photoURL } = user;

  return {
    name: displayName,
    email: email,
    avatar: photoURL,
  };
};

export const authChange = () => {
  const onAuthStateChanged = (onChange) => {
    return getAuth(app).onAuthStateChanged((user) => {
      const normalizedUser = user ? mapUserFromFirebaseAuth(user) : null;
      onChange(normalizedUser);
    });
  };
};

/* export const onAuthStateChanged = (onChange) => {
return getAuth(app).onAuthStateChanged((user) => {
const normalizedUser = user ? mapUserFromFirebaseAuthToUser(user) : null
onChange(normalizedUser)
})
} */

/* export const authChange = (onChange) => {
    onAuthStateChanged( auth, ( user ) => {

        const normalizedUser = mapUserFromFirebaseAuth( user );
        console.log( normalizedUser );

        const { displayName, email, photoURL } = user;
    
        const newUser = {
        name: displayName,
        email: email,
        avatar: photoURL,
        }
        return newUser;
});
} */

//OTRA FORMA DE HACER LA FUNCION AUTHCHANGE
/* export const authChange = ( onChange ) => {
    return onAuthStateChanged( auth, ( response ) => {
        const normalizedUser = mapUserFromFirebaseAuth( response );
        onChange( normalizedUser );
        console.log( "Sign In" );
});
} */

export const loginWithGithub = () => {
  const provider = new GithubAuthProvider();
  return signInWithPopup(auth, provider).then((response) => {
    return mapUserFromFirebaseAuth(response);
  });
};

export default app;
