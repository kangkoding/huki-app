import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect } from "react";

// 🧩 Pages
import SplashScreen from "./pages/SplashScreen";
import Onboarding from "./pages/OnBoarding";
import Home from "./pages/Home";
import PageWrapper from "./components/layouts/PageWrapper";
import Auth from "./pages/Auth";
import PrivateRoute from "./components/PrivateRoute";
import CompleteProfile from "./pages/CompleteProfile";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ArtikelList from "./pages/ArticleList";
import ArtikelDetail from "./pages/ArticleDetail";
import DokumenList from "./pages/DokumenList";
import DokumenDetail from "./pages/DokumenDetail";
import ForumList from "./pages/ForumList";
import ForumDetail from "./pages/ForumDetail";
import ForumNew from "./pages/ForumNew";
import BottomNav from "./components/layouts/BottomNav";
import KonsultasiList from "./pages/KonsultasiList";
import KonsultasiChat from "./pages/KonsultasiChat";
import AdminUsers from "./pages/AdminUsers";
import LawyerPanel from "./pages/LawyerPanel";
import LawyerChat from "./pages/LawyerChat";

// 🧠 Hooks & services
import { useFirebaseAuth } from "./hooks/useFirebaseAuth";
import { supabase } from "@/services/supabaseClient";

// ✅ Reusable ProtectedRoute
function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = useFirebaseAuth();
  const role = localStorage.getItem("role");

  if (loading) return <div className="p-4">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (requiredRole && role !== requiredRole) return <Navigate to="/home" replace />;

  return children;
}

import KonsultasiAdvokat from "./pages/KonsultasiAdvokat";
import KonsultasiLawyerProfile from "./pages/KonsultasiLawyerProfile";
import KonsultasiCall from "./pages/KonsultasiCall";
import DokumenTemplates from "./pages/DokumenTemplates";
import DokumenGenerate from "./pages/DokumenGenerate";
import DokumenUpload from "./pages/DokumenUpload";
import DokumenReview from "./pages/DokumenReview";
import ArtikelDinamisList from "./pages/ArtikelDinamisList";
import ArtikelDinamisDetail from "./pages/ArtikelDinamisDetail";
import Bookmarks from "./pages/Bookmarks";
import ForumByCategory from "./pages/ForumByCategory";
import AuthPhoneLogin from "./pages/AuthPhoneLogin";

export default function App() {
  const location = useLocation();
  const { user, loading } = useFirebaseAuth();

  // 🧠 Ambil role user dari Supabase saat login / refresh
  useEffect(() => {
    async function fetchRole() {
      if (user) {
        const { data, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.uid)
          .single();
        if (data && !error) {
          localStorage.setItem("role", data.role);
        }
      } else {
        localStorage.removeItem("role");
      }
    }
    if (!loading) fetchRole();
  }, [user, loading]);

  const hideNavPaths = ["/", "/onboarding", "/login", "/register", "/auth"];
  const hideNav = hideNavPaths.includes(location.pathname);

  return (
    <>
      <Routes>
        {/* Auth & onboarding */}
        <Route
          path="/"
          element={
            <PageWrapper page="splash">
              <SplashScreen />
            </PageWrapper>
          }
        />
        <Route
          path="/onboarding"
          element={
            <PageWrapper page="onboarding">
              <Onboarding />
            </PageWrapper>
          }
        />
        <Route
          path="/auth"
          element={
            <PageWrapper page="auth">
              <Auth />
            </PageWrapper>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* User Routes */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <PageWrapper page="home">
                <Home />
              </PageWrapper>
            </PrivateRoute>
          }
        />
        <Route path="/complete-profile" element={<CompleteProfile />} />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/artikel"
          element={
            <PageWrapper page="artikel">
              <ArtikelList />
            </PageWrapper>
          }
        />
        <Route
          path="/artikel/:id"
          element={
            <PageWrapper page="artikel-detail">
              <ArtikelDetail />
            </PageWrapper>
          }
        />
        <Route
          path="/dokumen"
          element={
            <PageWrapper page="dokumen">
              <DokumenList />
            </PageWrapper>
          }
        />
        <Route
          path="/dokumen/:id"
          element={
            <PageWrapper page="detail">
              <DokumenDetail />
            </PageWrapper>
          }
        />
        <Route
          path="/forum"
          element={
            <PageWrapper page="forum">
              <ForumList />
            </PageWrapper>
          }
        />
        <Route
          path="/forum/:id"
          element={
            <PageWrapper page="detail">
              <ForumDetail />
            </PageWrapper>
          }
        />
        <Route
          path="/forum/new"
          element={
            <PageWrapper page="forum">
              <ForumNew />
            </PageWrapper>
          }
        />
        <Route path="/konsultasi" element={<KonsultasiList />} />
        <Route path="/konsultasi/:id" element={<KonsultasiChat />} />

        {/* Lawyer Routes */}
        <Route
          path="/lawyer"
          element={
            <ProtectedRoute requiredRole="lawyer">
              <LawyerPanel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lawyer/chat/:userId"
          element={
            <ProtectedRoute requiredRole="lawyer">
              <LawyerChat />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminUsers />
            </ProtectedRoute>
          }
        />
      
        {/* User-Side extended routes */}
        <Route path="/login-phone" element={<AuthPhoneLogin />} />
        <Route path="/konsultasi/advokat" element={<KonsultasiAdvokat />} />
        <Route path="/konsultasi/advokat/:id" element={<KonsultasiLawyerProfile />} />
        <Route path="/konsultasi/call/:roomId" element={<KonsultasiCall />} />
        <Route path="/dokumen/templates" element={<DokumenTemplates />} />
        <Route path="/dokumen/generate/:type" element={<DokumenGenerate />} />
        <Route path="/dokumen/upload" element={<DokumenUpload />} />
        <Route path="/dokumen/review" element={<DokumenReview />} />
        <Route path="/artikel-dinamis" element={<ArtikelDinamisList />} />
        <Route path="/artikel-dinamis/:slug" element={<ArtikelDinamisDetail />} />
        <Route path="/bookmarks" element={<Bookmarks />} />
        <Route path="/forum/category/:categoryId" element={<ForumByCategory />} />

      </Routes>

      {!hideNav && <BottomNav />}
    </>
  );
}
