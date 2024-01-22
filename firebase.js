import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// const firebaseConfig = {
//   apiKey: "AIzaSyDiNLjf19bW0-5cvkOtdlqYI7YiDzt3WA0",
//   authDomain: "reifenhauser-2d366.firebaseapp.com",
//   projectId: "reifenhauser-2d366",
//   storageBucket: "reifenhauser-2d366.appspot.com",
//   messagingSenderId: "1000320736803",
//   appId: "1:1000320736803:web:c9db2603f14597edf45b96",
//   measurementId: "G-80E388KDKZ",
// };

const firebaseConfig = {
  apiKey: "AIzaSyA1h6QXsmX4PcYCZILMTtry8UaaMbcBNKg",
  authDomain: "agent-807a7.firebaseapp.com",
  databaseURL: "https://agent-807a7-default-rtdb.firebaseio.com",
  projectId: "agent-807a7",
  storageBucket: "agent-807a7.appspot.com",
  messagingSenderId: "918626263804",
  appId: "1:918626263804:web:627f47367e84af8e5c2d79"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);
const storage = getStorage(app);

export { analytics, app, db, storage };
