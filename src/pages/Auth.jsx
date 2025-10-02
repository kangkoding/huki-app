import { useState } from "react";
import { auth, googleProvider } from "@/services/firebase";
import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);

  const navigate = useNavigate();

  // --- Email Auth ---
  const handleEmailAuth = async () => {
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate("/home");
    } catch (err) {
      alert(err.message);
    }
  };

  // --- Google Auth ---
  const handleGoogleAuth = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/home");
    } catch (err) {
      alert(err.message);
    }
  };

  // --- Setup Recaptcha ---
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        { size: "invisible" },
        auth
      );
    }
  };

  // --- Kirim OTP ---
  const sendOtp = async () => {
    try {
      setupRecaptcha();
      const confirmation = await signInWithPhoneNumber(
        auth,
        phone,
        window.recaptchaVerifier
      );
      setConfirmationResult(confirmation);
      alert("OTP sudah dikirim ke " + phone);
    } catch (err) {
      alert(err.message);
    }
  };

  // --- Verifikasi OTP ---
  const verifyOtp = async () => {
    try {
      await confirmationResult.confirm(otp);
      navigate("/home");
    } catch (err) {
      alert("OTP salah!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 px-6">
      <h2 className="text-2xl font-bold text-cyan-700 mb-6">
        {isRegister ? "Daftar" : "Masuk"} Si Huki
      </h2>

      {/* Email / Password */}
      <input
        type="email"
        placeholder="Email"
        className="w-full mb-3 p-3 border rounded-xl"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full mb-4 p-3 border rounded-xl"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={handleEmailAuth}
        className="w-full bg-cyan-600 text-white py-3 rounded-xl mb-3"
      >
        {isRegister ? "Daftar" : "Masuk"}
      </button>

      {/* Google Sign-in */}
      <button
        onClick={handleGoogleAuth}
        className="w-full bg-red-500 text-white py-3 rounded-xl mb-3"
      >
        Masuk dengan Google
      </button>

      {/* Phone OTP */}
      <input
        type="text"
        placeholder="+62 812-xxxx-xxxx"
        className="w-full mb-3 p-3 border rounded-xl"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <button
        onClick={sendOtp}
        className="w-full bg-yellow-500 text-white py-3 rounded-xl mb-3"
      >
        Kirim OTP
      </button>

      {confirmationResult && (
        <>
          <input
            type="text"
            placeholder="Masukkan OTP"
            className="w-full mb-3 p-3 border rounded-xl"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button
            onClick={verifyOtp}
            className="w-full bg-green-600 text-white py-3 rounded-xl mb-3"
          >
            Verifikasi OTP
          </button>
        </>
      )}

      {/* Recaptcha */}
      <div id="recaptcha-container"></div>

      <p
        onClick={() => setIsRegister(!isRegister)}
        className="text-sm text-cyan-700 cursor-pointer"
      >
        {isRegister ? "Sudah punya akun? Masuk" : "Belum punya akun? Daftar"}
      </p>
    </div>
  );
}
