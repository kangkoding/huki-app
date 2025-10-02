import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://nfksbpuyfsmndqetlzie.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ma3NicHV5ZnNtbmRxZXRsemllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzMDM0MjYsImV4cCI6MjA3NDg3OTQyNn0.4XAiMn0u04YfHr86iC8SZDA0Vzy3baHdLOnM5J8cq80";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

if (typeof window !== "undefined") {
  window.supabase = supabase;
}
