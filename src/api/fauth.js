import {
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";
import { db, firebaseAuth } from "./fbase";
import { get, ref } from "firebase/database";

export function signInWithGoogle() {
  const provider = new GoogleAuthProvider();

  signInWithPopup(firebaseAuth, provider).then((result) => {
    const user = result.user;
    setTimeout(() => {
      alert("로그인 되었습니다!");
    }, 100);
    return user;
  });
}

export function logout() {
  firebaseAuth.signOut();
  alert("로그아웃 되었습니다!");
}

// 로그인/로그아웃 또는 어플리케이션이 시작할 때 로그인한 사용자의 정보가 session에 남아있으면 callback 함수 호출
export function onUserStateChange(callback) {
  onAuthStateChanged(firebaseAuth, async (user) => {
    // 사용자가 있는 경우에 (로그인한 경우)
    const updatedUser = user ? await adminUser(user) : null;
    callback(updatedUser);
  });
}

function adminUser(user) {
  // 사용자가 어드민 권한을 가지고 있는지 확인 {...user, isAdmin: true/false}
  return get(ref(db, "admins")).then((snapshot) => {
    if (snapshot.exists()) {
      const admins = snapshot.val();
      const isAdmin = admins.includes(user.uid);
      return { ...user, isAdmin };
    }
    return user;
  });
}
