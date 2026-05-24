import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder";

const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data, error } = await supabaseAdmin
    .from("posts")
    .select("*")
    .or("slug.eq.blockquote-p-p-hello-reader-blockqu-x6pe0b");
  
  console.log("Error:", error);
  console.log("Data:", data);
}

main();
