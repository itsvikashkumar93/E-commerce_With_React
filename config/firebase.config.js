const fbAdmin = require("firebase-admin");
const firebaseCredentials = require("../etc/secrets/e-commerce-react-181d5-firebase-adminsdk-l1z1w-c3ff0eb38f.json");

fbAdmin.initializeApp({
  credential: fbAdmin.credential.cert(firebaseCredentials),
  storageBucket: "e-commerce-react-181d5.appspot.com",
});

module.exports = fbAdmin;
