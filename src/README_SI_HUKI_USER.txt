SI HUKI - USER SIDE ADDITIONS

1) Supabase SQL: jalankan skrip schema di chat untuk tabel lawyers, consultations, document_jobs, articles, bookmarks, forum_categories, announcements.
2) Storage: buat bucket 'chat-files' dan 'documents' public.
3) Routes baru: sudah ada file pages* ini, tambah Route di App.jsx:
   - /login-phone -> AuthPhoneLogin
   - /konsultasi/advokat -> KonsultasiAdvokat
   - /konsultasi/advokat/:id -> KonsultasiLawyerProfile
   - /konsultasi/call/:roomId -> KonsultasiCall
   - /dokumen/templates -> DokumenTemplates
   - /dokumen/generate/:type -> DokumenGenerate
   - /dokumen/upload -> DokumenUpload
   - /dokumen/review -> DokumenReview
   - /artikel-dinamis -> ArtikelDinamisList
   - /artikel-dinamis/:slug -> ArtikelDinamisDetail
   - /bookmarks -> Bookmarks
   - /forum/category/:categoryId -> ForumByCategory
4) FCM:
   - Buat file public/firebase-messaging-sw.js (lihat konten pada chat).
   - Isi YOUR_VAPID_KEY dan Firebase config di SW dan services/firebase.js.
