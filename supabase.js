const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || 'https://ncwehhjhlpkrgygcsqxo.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jd2VtaGpobHBrcmd5Z2NzcXhvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTk0NDE4MywiZXhwIjoyMDkxNTIwMTgzfQ.crPEmukE-OhRWU6Ypb5oaoeFCHZsjOrBUeFqx9sW9Ns';

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
