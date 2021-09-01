import { initializeApp } from "firebase/app";
import admin = require('firebase-admin');
import serviceAccount = require('./sps-bot-key.json');

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCmmf-PY9JFAbbcoRlxCEQP6kABFzkYY-U",
  authDomain: "sps-bot-deb06.firebaseapp.com",
  projectId: "sps-bot-deb06",
  storageBucket: "sps-bot-deb06.appspot.com",
  messagingSenderId: "399202606967",
  appId: "1:399202606967:web:76054e4c27186742940b72",
  credentials: admin.credential.cert({
    projectId: serviceAccount.project_id,
    clientEmail: serviceAccount.client_email,
    privateKey: serviceAccount.private_key
  }),
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: serviceAccount.project_id,
    privateKey: serviceAccount.private_key,
    clientEmail: serviceAccount.client_email,
  })
});
const db = admin.firestore();
const questionsDoc = db.doc("questions/questions");

export const unansweredCollection = questionsDoc.collection("unanswered");
export const answeredCollection = questionsDoc.collection("answered");

module.exports = {
  answeredCollection: answeredCollection,
  unansweredCollection: unansweredCollection
};
