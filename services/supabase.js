import { createClient } from '@supabase/supabase-js';

// YOUR ACTUAL SUPABASE URL
const SUPABASE_URL = 'https://abnnfrocwjgtmszfxmcu.supabase.co';

// YOUR ACTUAL SUPABASE ANON KEY
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFibm5mcm9jd2pndG1zemZ4bWN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxMTA3NDMsImV4cCI6MjA4MjY4Njc0M30.8GgsbHusHft_m4ZAEiO456EL8vjDBYLkH6in-FVo10I';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Checks if a provided license key is valid and active in the database.
 * @param {string} licenseKey - The license key entered by the user.
 * @returns {Promise<boolean>} - Returns true if the license matches and is active, else false.
 */
export async function checkLicense(licenseKey) {
  try {
    // Formats input to safely match database entries (removes whitespace and forces uppercase)
    const formattedKey = licenseKey.trim().toUpperCase().replace(/\s/g, '');

    const { data, error } = await supabase
      .from('licenses')
      .select('license_key')
      .eq('license_key', formattedKey)
      .eq('is_active', true)
      .maybeSingle(); // Prevents crashing if 0 rows or multiple rows are found

    if (error) {
      console.log('Supabase Error:', error.message);
      return false;
    }

    // If a matching row is returned, the key is valid and active
    return !!data;
  } catch (err) {
    console.log('License Check Failed:', err);
    return false;
  }
}
