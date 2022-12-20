import { initializeApp } from "firebase/app";
import {
  getFirestore,
  addDoc,
  collection,
  Timestamp,
} from "firebase/firestore";
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

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

const mapUserFromFirebaseAuthToUser = (user) => {
  const { displayName, email, photoURL, uid } = user;

  return {
    name: displayName,
    email: email,
    avatar: photoURL,
    uid: uid,
  };
};

export const authChange = (onChange) => {
  return getAuth(app).onAuthStateChanged((user) => {
    const normalizedUser = user ? mapUserFromFirebaseAuthToUser(user) : null;
    onChange(normalizedUser);
  });
};

export const loginWithGithub = () => {
  const provider = new GithubAuthProvider();
  return signInWithPopup(auth, provider).then((response) => {
    return mapUserFromFirebaseAuthToUser(response);
  });
};

export const addDevit = ({ avatar, content, userId, userName }) => {
  addDoc(collection(db, "devits"), {
    avatar,
    content,
    userId,
    userName,
    createdAt: Timestamp.fromDate(new Date()),
    likesCount: 0,
    sharedCount: 0,
  });
};

/* return db.collection(db, "devits").add({
    avatar,
    content,
    userId,
    userName,
    createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
    likesCount: 0,
    sharedCount: 0,
  }); */

export default app;
