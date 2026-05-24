// check-build.js
const fs = require('fs');
const path = require('path');

console.log("--- Starting Build Environment Verification ---");

try {
  // 1. Verify that eas.json exists securely in the root directory
  const easPath = path.join(__dirname, 'eas.json');
  
  if (!fs.existsSync(easPath)) {
    console.error("❌ Error: eas.json configuration file missing from root directory.");
    process.exit(1);
  }

  // 2. Read and parse eas.json to validate internal environment variables
  const easConfig = JSON.parse(fs.readFileSync(easPath, 'utf8'));
  const previewEnv = easConfig?.build?.preview?.env;

  if (!previewEnv || !previewEnv.EXPO_PUBLIC_SUPABASE_URL || !previewEnv.EXPO_PUBLIC_SUPABASE_ANON_KEY) {
    console.error("❌ Error: Missing Supabase production credentials in eas.json environment block.");
    process.exit(1);
  }

  console.log("✅ Build environment variables verified successfully.");
  process.exit(0);

} catch (error) {
  console.error("❌ Build Check Exception Caught:", error.message);
  process.exit(1);
}