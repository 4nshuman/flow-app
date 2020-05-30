import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyBNoJNobVYIzXZe-QQOmiIk30EaxY_4dKk",
    authDomain: "flow-app-d2f79.firebaseapp.com",
    databaseURL: "https://flow-app-d2f79.firebaseio.com",
    projectId: "flow-app-d2f79",
    storageBucket: "flow-app-d2f79.appspot.com",
    messagingSenderId: "24188334009",
    appId: "1:24188334009:web:d0f04102116b969b279068"
  };

const base = firebase.initializeApp(firebaseConfig);

export { base }