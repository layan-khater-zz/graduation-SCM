// Initialize Firebase
export var config = {
  apiKey: "AIzaSyB__a3Pk1c1GDQc2zknguIfu4_ECZBbUW0",
  authDomain: "together-d9ca0.firebaseapp.com",
  databaseURL: "https://together-d9ca0.firebaseio.com",
  projectId: "together-d9ca0",
  storageBucket: "together-d9ca0.appspot.com",
  messagingSenderId: "905615168908"
};
export var init=firebase.initializeApp(config);
export var database=firebase.database().ref();
export var auth=firebase.auth();
