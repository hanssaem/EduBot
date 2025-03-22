import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import googleLoginImg from '../assets/google_social_login.png';
import { SiProbot } from 'react-icons/si';

export default function Login() {
  const navigate = useNavigate();
  const handleGoogleSign = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken(); // ✅ Firebase에서 ID 토큰 가져오기

      console.log('✅ Firebase 로그인 성공:', result.user);
      console.log('✅ Firebase ID Token:', idToken);

      // ✅ 백엔드로 ID 토큰 전송
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      const data = await response.json();
      console.log('✅ 백엔드 응답:', data);
      navigate('/');
    } catch (err) {
      console.error('❌ 로그인 실패:', err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <button
        className="font-bold text-3xl flex pl-2 mb-2"
        onClick={() => navigate('/')}
      >
        EduBot
        <SiProbot className="ml-2 text-3xl" />
      </button>
      <p className="text-gray-600 mb-6">
        학습을 더 효율적으로 만드는 AI 도우미
      </p>
      <div className="p-8 rounded-md border border-gray-200 flex flex-col w-96 text-center items-center gap-6">
        <h1 className="font-pretendard text-2xl font-semibold text-left">
          소셜 계정으로 로그인 하여
          <br />
          Edubot 서비스를 이용해보세요
        </h1>

        <div className="border-t border-gray-600 border-dashed w-full"></div>

        <p className="text-gray-600 text-sm">간편 로그인</p>

        <button className="w-48 flex" onClick={handleGoogleSign}>
          <img src={googleLoginImg} alt="Google 로그인" className="w-full" />
        </button>
      </div>
    </div>
  );
}
