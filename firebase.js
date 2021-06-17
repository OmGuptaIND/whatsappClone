import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyA8SGxTqBD8yVOGThuISi6RlIAqgMdzzVA",
    authDomain: "chatapp-deb57.firebaseapp.com",
    projectId: "chatapp-deb57",
    storageBucket: "chatapp-deb57.appspot.com",
    messagingSenderId: "76397718124",
    appId: "1:76397718124:web:b923011bce68806fe9c649",
    measurementId: "G-MWRBS4W9FV"
  };

const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();

const db = app.firestore();
const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider };
