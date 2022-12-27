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
import {
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

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

export const uploadImage = (file) => {
  const storageRef = ref(storage, `/posts ${file.name}`);
  // 'file' comes from the Blob or File API
  const uploadTask = uploadBytesResumable(storageRef, file);
  // Listen for state changes, errors, and completion of the upload.
  uploadTask.on(
    "state_changed",
    (snapshot) => {
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log("Upload is " + progress + "% done");
      switch (snapshot.state) {
        case "paused":
          console.log("Upload is paused");
          break;
        case "running":
          console.log("Upload is running");
          break;
      }
    },
    (error) => {
      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case "storage/unauthorized":
          // User doesn't have permission to access the object
          break;
        case "storage/canceled":
          // User canceled the upload
          break;

        // ...

        case "storage/unknown":
          // Unknown error occurred, inspect error.serverResponse
          break;
      }
    },
    () => {
      // Upload completed successfully, now we can get the download URL
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        console.log("File available at", downloadURL);
      });
    }
  );
};

export default app;
