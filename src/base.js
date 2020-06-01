import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyDuc7xPtpXTHai2Rjm-zzdtOixQyNUlyV4",
    authDomain: "flow-app-6ff4d.firebaseapp.com",
    databaseURL: "https://flow-app-6ff4d.firebaseio.com",
    projectId: "flow-app-6ff4d",
    storageBucket: "flow-app-6ff4d.appspot.com",
    messagingSenderId: "136613610861",
    appId: "1:136613610861:web:b0f74789e03781ef5ac664",
    measurementId: "G-LNDERJT86N"
  };

const base = firebase.initializeApp(firebaseConfig);

export { base }
