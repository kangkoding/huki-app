import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/services/firebase";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";

export default function PrivateRoute({ children }) {
  const [user, loading] = useAuthState(auth);
  const [checking, setChecking] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    const checkProfile = async () => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setHasProfile(true);
        }
      }
      setChecking(false);
    };

    if (user) checkProfile();
    else setChecking(false);
  }, [user]);

  if (loading || checking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 animate-pulse">Checking session...</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" />;
  if (user && !hasProfile) return <Navigate to="/complete-profile" />;

  return children;
}
