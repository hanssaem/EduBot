import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const handleGoogleSign = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken(); // ✅ Firebase에서 ID 토큰 가져오기

      console.log("✅ Firebase 로그인 성공:", result.user);
      console.log("✅ Firebase ID Token:", idToken);

      // ✅ 백엔드로 ID 토큰 전송
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      });

      const data = await response.json();
      console.log("✅ 백엔드 응답:", data);
      navigate('/');
    } catch (err) {
      console.error("❌ 로그인 실패:", err);
    }
  };

  return (
    <div>
      <button onClick={handleGoogleSign}>Login</button>
    </div>
  );
}
