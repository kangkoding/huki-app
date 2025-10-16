import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect } from "react";
import PageWrapper from "./components/layouts/PageWrapper";

import SplashScreen from "./pages/SplashScreen";
import Onboarding from "./pages/OnBoarding";
import Home from "./pages/Home";
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
import AdminArticles from "./pages/AdminArticles";
import LawyerList from "./pages/LawyerList";
import LawyerDetail from "./pages/LawyerDetail";
import PilihBidangHukum from "./pages/PilihBidangHukum";
import UserChatHistory from "./pages/UserChatHistory";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLawyers from "./pages/AdminLawyers";
import AdminNotifications from "./pages/AdminNotifications";
import LawyerProfile from "./pages/LawyerProfile";
import PaymentPage from "./pages/PaymentPage";

import { useFirebaseAuth } from "./hooks/useFirebaseAuth";
import { supabase } from "@/services/supabaseClient";
import AdminTransactions from "./pages/AdminTransactions";
import RiwayatTransaksi from "./pages/RiwayatTransaksi";

function LawyerRoute({ children }) {
  const { user, loading } = useFirebaseAuth();
  const role = localStorage.getItem("role");
  if (loading) return <div className="p-4">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (role !== "lawyer") return <Navigate to="/home" replace />;
  return children;
}
function AdminRoute({ children }) {
  const { user, loading } = useFirebaseAuth();
  const role = localStorage.getItem("role");
  if (loading) return <div className="p-4">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (role !== "admin") return <Navigate to="/home" replace />;
  return children;
}

export default function App() {
  const location = useLocation();
  const { user } = useFirebaseAuth();

  useEffect(() => {
    async function fetchRole() {
      if (user) {
        const { data, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.uid)
          .single();
        if (!error && data) localStorage.setItem("role", data.role || "user");
      } else {
        localStorage.removeItem("role");
      }
    }
    fetchRole();
  }, [user]);

  const hideNavPaths = ["/", "/onboarding", "/login", "/register", "/auth"];
  const hideNav = hideNavPaths.includes(location.pathname);

  return (
    <>
      <Routes>
        {/* Auth & onboarding */}
        <Route
          path="/"
          element={
            <PageWrapper>
              <SplashScreen />
            </PageWrapper>
          }
        />
        <Route
          path="/onboarding"
          element={
            <PageWrapper>
              <Onboarding />
            </PageWrapper>
          }
        />
        <Route
          path="/auth"
          element={
            <PageWrapper>
              <Auth />
            </PageWrapper>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* User */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <PageWrapper>
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
            <PageWrapper>
              <ArtikelList />
            </PageWrapper>
          }
        />
        <Route
          path="/artikel/:id"
          element={
            <PageWrapper>
              <ArtikelDetail />
            </PageWrapper>
          }
        />
        <Route
          path="/dokumen"
          element={
            <PageWrapper>
              <DokumenList />
            </PageWrapper>
          }
        />
        <Route
          path="/dokumen/:id"
          element={
            <PageWrapper>
              <DokumenDetail />
            </PageWrapper>
          }
        />
        <Route
          path="/forum"
          element={
            <PageWrapper>
              <ForumList />
            </PageWrapper>
          }
        />
        <Route
          path="/forum/:id"
          element={
            <PageWrapper>
              <ForumDetail />
            </PageWrapper>
          }
        />
        <Route
          path="/forum/new"
          element={
            <PageWrapper>
              <ForumNew />
            </PageWrapper>
          }
        />
        <Route
          path="/konsultasi"
          element={
            <PageWrapper>
              <KonsultasiList />
            </PageWrapper>
          }
        />
        <Route
          path="/konsultasi/:id"
          element={
            <PageWrapper>
              <KonsultasiChat />
            </PageWrapper>
          }
        />
        <Route
          path="/lawyers"
          element={
            <PageWrapper>
              <LawyerList />
            </PageWrapper>
          }
        />
        <Route
          path="/lawyers/:id"
          element={
            <PageWrapper>
              <LawyerDetail />
            </PageWrapper>
          }
        />
        <Route
          path="/pilih-bidang"
          element={
            <PageWrapper>
              <PilihBidangHukum />
            </PageWrapper>
          }
        />
        <Route
          path="/riwayat-chat"
          element={
            <PageWrapper>
              <UserChatHistory />
            </PageWrapper>
          }
        />
        <Route
          path="/riwayat-transaksi"
          element={
            <PageWrapper>
              <RiwayatTransaksi />
            </PageWrapper>
          }
        />
        <Route
          path="/payment/:lawyerId"
          element={
            <PageWrapper>
              <PaymentPage />
            </PageWrapper>
          }
        />

        {/* Lawyer */}
        <Route
          path="/lawyer"
          element={
            <LawyerRoute>
              <PageWrapper>
                <LawyerPanel />
              </PageWrapper>
            </LawyerRoute>
          }
        />
        <Route
          path="/lawyer/chat/:userId"
          element={
            <LawyerRoute>
              <PageWrapper>
                <LawyerChat />
              </PageWrapper>
            </LawyerRoute>
          }
        />
        <Route
          path="/lawyer/profile"
          element={
            <LawyerRoute>
              <PageWrapper>
                <LawyerProfile />
              </PageWrapper>
            </LawyerRoute>
          }
        />

        {/* Admin */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <PageWrapper>
                <AdminUsers />
              </PageWrapper>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/articles"
          element={
            <AdminRoute>
              <PageWrapper>
                <AdminArticles />
              </PageWrapper>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/lawyers"
          element={
            <AdminRoute>
              <PageWrapper>
                <AdminLawyers />
              </PageWrapper>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/notifications"
          element={
            <AdminRoute>
              <PageWrapper>
                <AdminNotifications />
              </PageWrapper>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/transactions"
          element={
            <AdminRoute>
              <PageWrapper>
                <AdminTransactions />
              </PageWrapper>
            </AdminRoute>
          }
        />
      </Routes>

      {!hideNav && <BottomNav />}
    </>
  );
}
