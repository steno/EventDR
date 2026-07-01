import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export type DbVenue = {
  slug: string;
  name: string;
  city: string;
  description: string | null;
  lat: number;
  lng: number;
  emoji: string | null;
  instagram: string | null;
  website: string | null;
};

export type DbEvent = {
  id: string;
  title: string;
  description: string;
  date: string;
  end_date: string | null;
  time: string | null;
  location: string;
  venue_slug: string | null;
  venue_name: string | null;
  category: string;
  format: string;
  trending: boolean | null;
  source_url: string | null;
  source_type: string | null;
  image_emoji: string | null;
  lat: number | null;
  lng: number | null;
  status: string;
  locale: string | null;
  created_at: string | null;
};

let adminClient: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

export function getSupabaseAdmin(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  if (!adminClient) {
    adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } },
    );
  }
  return adminClient;
}

export function getSupabaseAnon(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}
