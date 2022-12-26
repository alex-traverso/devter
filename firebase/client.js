import { initializeApp } from "firebase/app";
import {
  getFirestore,
  addDoc,
  collection,
  Timestamp,
  doc,
  getDoc,
  getDocs,
  query,
  orderBy,
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
    username: displayName,
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

export const addDevit = async ({ avatar, content, userId, userName }) => {
  try {
    await addDoc(collection(db, "devits"), {
      avatar,
      content,
      userId,
      userName,
      createdAt: Timestamp.fromDate(new Date()),
      likesCount: 0,
      sharedCount: 0,
    });
  } catch (err) {
    console.log(err);
  }
};

export const fetchLatestDevits = async () => {
  const q = query(collection(db, "devits"), orderBy("createdAt", "desc"));
  const querySnapshot = getDocs(q);

  return await querySnapshot.then(({ docs }) => {
    return docs.map((doc) => {
      const data = doc.data();
      const id = doc.id;
      const { createdAt } = data;

      return {
        ...data,
        id,
        createdAt: +createdAt.toDate(),
      };
    });
  });
};

export default app;
