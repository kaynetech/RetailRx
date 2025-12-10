import { createClient } from '@supabase/supabase-js';

// Initialize database client using environment variables
// For development, you can use the default values below
// For production, set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://nxddokktpqipsyngfuqq.databasepad.com';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjQwNDdjYWI0LWI5ZTktNDkyNS05OTgwLTIwN2RhZTdjODNkNSJ9.eyJwcm9qZWN0SWQiOiJueGRkb2trdHBxaXBzeW5nZnVxcSIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzYzNjY1OTExLCJleHAiOjIwNzkwMjU5MTEsImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.-FYQbzlbC-Kr_AhnDAhMImqwjwzO18t9nGmPCG9JGBU';

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    'Supabase credentials not found. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.'
  );
}

const supabase = createClient(supabaseUrl, supabaseKey);

export { supabase };
