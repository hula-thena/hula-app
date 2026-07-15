import { createClient } from "@supabase/supabase-js";

// ↓↓↓ 이 두 줄만 본인 것으로 바꾸세요 (Supabase → Project Settings → API 에서 복사) ↓↓↓
const URL = "https://tsytcpcwyzrynhonapfx.supabase.co";
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzeXRjcGN3eXpyeW5ob25hcGZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyNjY5OTIsImV4cCI6MjA5Nzg0Mjk5Mn0.WF7HmKbW74kpRYaorV9KFjyb-AEb7vfKD-cKyMUfdEk";
// ↑↑↑ 따옴표 안의 안내 문구를 지우고, 복사한 값을 그 자리에 넣으면 돼요 ↑↑↑

export const supabase = createClient(URL, KEY);
