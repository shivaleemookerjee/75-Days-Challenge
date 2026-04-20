import { auth, provider, db, messaging } from "./firebase.js";
import { signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getToken } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging.js";

const total = 75;
let userId = null;
let data = {};

// 🔐 LOGIN
document.getElementById("login").onclick = () => {
  signInWithPopup(auth, provider);
};

// 🚪 LOGOUT
document.getElementById("logout").onclick = () => {
  signOut(auth);
};

// 👤 USER STATE
onAuthStateChanged(auth, async (user) => {
  if(user){
    userId = user.uid;
    document.getElementById("user").innerText = "Hi " + user.displayName;
    loadData();
  }
});

// 📊 LOAD
async function loadData(){
  const ref = doc(db, "users", userId);
  const snap = await getDoc(ref);
  data = snap.exists() ? snap.data() : {};
  render();
}

// 💾 SAVE
function save(){
  setDoc(doc(db,"users",userId), data);
}

// 🎯 RENDER
function render(){
  const container = document.getElementById("days");
  container.innerHTML = "";

  let done = 0;

  for(let i=0;i<total;i++){
    const key="d"+i;

    const div=document.createElement("div");
    div.className="day"+(data[key]?" done":"");
    div.innerText=i+1;

    div.onclick=()=>{
      data[key]=!data[key];
      save();
      render();
    }

    if(data[key]) done++;
    container.appendChild(div);
  }

  document.getElementById("progress").innerText =
    `Completed: ${done}/${total}`;
}

// 🔔 PUSH NOTIFICATIONS
document.getElementById("notify").onclick = async () => {
  const permission = await Notification.requestPermission();

  if(permission === "granted"){
    const token = await getToken(messaging, {
      vapidKey: "YOUR_VAPID_KEY"
    });

    alert("Notifications enabled 💖");
    console.log("TOKEN:", token);
  }
};

// REGISTER SERVICE WORKER
if('serviceWorker' in navigator){
  navigator.serviceWorker.register('service-worker.js');
}
