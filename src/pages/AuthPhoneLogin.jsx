import { useEffect, useState } from "react";
import { auth } from "@/services/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function AuthPhoneLogin() {
  const [phone, setPhone] = useState(""); // format: +62xxx
  const [otp, setOtp] = useState("");
  const [confirmRes, setConfirmRes] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    // eslint-disable-next-line no-undef
    window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", { size: "invisible" });
  }, []);

  async function sendOtp(e) {
    e.preventDefault();
    const appVerifier = window.recaptchaVerifier;
    const confirmation = await signInWithPhoneNumber(auth, phone, appVerifier);
    setConfirmRes(confirmation);
    alert("OTP terkirim");
  }

  async function verifyOtp(e) {
    e.preventDefault();
    await confirmRes.confirm(otp);
    nav("/complete-profile");
  }

  return (
    <div className="p-4 pb-24">
      <h1 className="text-xl font-bold mb-4">Login dengan Nomor HP</h1>
      <div id="recaptcha-container"></div>
      {!confirmRes ? (
        <form onSubmit={sendOtp} className="space-y-3">
          <input className="w-full border rounded px-3 py-2" placeholder="+62..." value={phone} onChange={e=>setPhone(e.target.value)} />
          <button className="w-full bg-blue-600 text-white py-2 rounded">Kirim OTP</button>
        </form>
      ) : (
        <form onSubmit={verifyOtp} className="space-y-3">
          <input className="w-full border rounded px-3 py-2" placeholder="Masukkan OTP" value={otp} onChange={e=>setOtp(e.target.value)} />
          <button className="w-full bg-green-600 text-white py-2 rounded">Verifikasi</button>
        </form>
      )}
    </div>
  );
}
