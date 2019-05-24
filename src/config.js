import Firebase from "firebase";
var conf = {
    apiKey: "AIzaSyBaAFsuMMRTIkgKdhKky2XzIo7vC-FNeew",
    authDomain: "sinai-b9d68.firebaseapp.com",
    databaseURL: "https://sinai-b9d68.firebaseio.com",
    projectId: "sinai-b9d68",
    storageBucket: "sinai-b9d68.appspot.com",
    messagingSenderId: "295694321019",
    appId: "1:295694321019:web:b0f3d3b9be532099"
}
Firebase.initializeApp(conf);
let db = Firebase.database();
export default {
   db : db 
}