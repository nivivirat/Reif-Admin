import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDiNLjf19bW0-5cvkOtdlqYI7YiDzt3WA0",
  authDomain: "reifenhauser-2d366.firebaseapp.com",
  databaseURL: "https://reifenhauser-2d366-default-rtdb.firebaseio.com",
  projectId: "reifenhauser-2d366",
  storageBucket: "reifenhauser-2d366.appspot.com",
  messagingSenderId: "1000320736803",
  appId: "1:1000320736803:web:c9db2603f14597edf45b96",
  measurementId: "G-80E388KDKZ"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);
const storage = getStorage(app);

export { analytics, app, db, storage };
