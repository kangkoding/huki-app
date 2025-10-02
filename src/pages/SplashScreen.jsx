import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../icons/512.png";

export default function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/onboarding");
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <img src={logo} alt="Si Huki Logo" className="w-28 h-28 animate-pulse" />
    </div>
  );
}
