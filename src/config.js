import Firebase from "firebase";
var conf = {
   // JAASIEL
   //  apiKey: "AIzaSyBaAFsuMMRTIkgKdhKky2XzIo7vC-FNeew",
   //  authDomain: "sinai-b9d68.firebaseapp.com",
   //  databaseURL: "https://sinai-b9d68.firebaseio.com",
   //  projectId: "sinai-b9d68",
   //  storageBucket: "sinai-b9d68.appspot.com",
   //  messagingSenderId: "295694321019",
   //  appId: "1:295694321019:web:b0f3d3b9be532099"

   // SINAI
   apiKey: "AIzaSyCuyEPDRJ1wZgHKM-vNSDa9etD0O8BAYGU",
   authDomain: "sinai-28c9b.firebaseapp.com",
   databaseURL: "https://sinai-28c9b.firebaseio.com",
   projectId: "sinai-28c9b",
   storageBucket: "sinai-28c9b.appspot.com",
   messagingSenderId: "892358533325",
   appId: "1:892358533325:web:4e769667d934852e"
}
Firebase.initializeApp(conf);
let db = Firebase.database();
export default {
   db: db
}