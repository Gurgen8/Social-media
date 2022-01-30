import firebase from 'firebase';


const firebaseConfig = {

    apiKey: "AIzaSyA4kuKL30y08Oy_p8Mj6qCt3Ez00a2EQtA",
    authDomain: "facecontact-notification.firebaseapp.com",
    projectId: "facecontact-notification",
    storageBucket: "facecontact-notification.appspot.com",
    messagingSenderId: "488292454980",
    appId: "1:488292454980:web:cb44f3e73e6f8558f22211",

}

firebase.initializeApp(firebaseConfig);

export default firebase;