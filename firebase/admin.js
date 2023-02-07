const admin = require("firebase-admin");

try {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // remplaza los caracteres '/' y 'n' y los transforma en un solo caracter
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
} catch (err) {
  console.error(err);
}

export const firestore = admin.firestore();
