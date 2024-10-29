const multer = require("multer");
const FirebaseStorage = require("multer-firebase-storage");
const firebaseCredentials = require("../e-commerce-react-181d5-firebase-adminsdk-l1z1w-c3ff0eb38f.json");
const fbAdmin = require("./firebase.config");

const storage = FirebaseStorage({
  bucketName: "e-commerce-react-181d5.appspot.com",
  credentials: fbAdmin.credential.cert(firebaseCredentials),
  unique: true,
  public: true,
});

const upload = multer({
  storage: storage,
});

module.exports = upload;
