/* SERVICE: Initializes the Supabase client. */
const supabaseUrl = 'https://mqbaaoayugpnhofpaidx.supabase.co'; // Note: SDK expects base URL, not the /rest/v1/ suffix
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xYmFhb2F5dWdwbmhvZnBhaWR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkyNzUwNzcsImV4cCI6MjEwNDg1MTA3N30.mxzUgKgrLcb84bCJdnoFPYnvI2YmFAouGLTZKuItaR4';

// Use the global supabase object from the CDN
const sbClient = window.supabase.createClient(supabaseUrl, supabaseKey);
