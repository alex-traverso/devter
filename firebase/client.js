import { initializeApp } from "firebase/app";
import {
  getFirestore,
  addDoc,
  collection,
  Timestamp,
  doc,
  getDoc,
  onSnapshot,
  getDocs,
  query,
  orderBy,
  updateDoc,
  increment,
  setDoc,
} from "firebase/firestore";
import {
  getAuth,
  signInWithPopup,
  GithubAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";
import { getStorage, ref, uploadBytesResumable } from "firebase/storage";

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
export const db = getFirestore(app);

//Inicia firebase storage
const storage = getStorage(app);

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

export const addDevit = async ({ avatar, content, userId, userName, img }) => {
  try {
    await addDoc(collection(db, "devits"), {
      avatar,
      content,
      img,
      userId,
      userName,
      createdAt: Timestamp.fromDate(new Date()),
      liked: false,
      sharedCount: 0,
    });
  } catch (err) {
    console.log(err);
  }
};

const mapDevitFromFirebaseToDevitObjet = (doc) => {
  const data = doc.data();
  const id = doc.id;
  const { createdAt } = data;

  return {
    ...data,
    id,
    createdAt: +createdAt.toDate(),
  };
};

export const listenLatestDevits = (callback) => {
  const q = query(collection(db, "devits"), orderBy("createdAt", "desc"));
  const listen = onSnapshot(q, ({ docs }) => {
    const newDevits = docs.map(mapDevitFromFirebaseToDevitObjet);
    callback(newDevits);
  });
};

export const uploadImage = (file) => {
  const storageRef = ref(storage, `/posts ${file.name}`);
  // 'file' comes from the Blob or File API
  const uploadTask = uploadBytesResumable(storageRef, file);
  return uploadTask;
};

/* export const addLike = async () => {
  const q = query(collection(db, "devits"), orderBy("createdAt", "desc"));
  const listen = onSnapshot(q, ({ docs }) => {
    const newDevits = docs.map((devit) => {
      const id = devit.id;
      const devitLiked = doc(db, "devits", id);
      updateDoc(devitLiked, {
        liked: true,
      });
    });
  });
}; */

export default app;
