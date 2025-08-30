import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vyppdzxhmkkccwyexnlv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5cHBkenhobWtrY2N3eWV4bmx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NjY4NTksImV4cCI6MjA3MDU0Mjg1OX0.a_lxnRWhK6U7WECkzTC8RuvTdvj5_C39eUIvjQnnA6Q';
const supabase = createClient(supabaseUrl, supabaseKey);

export { supabase };