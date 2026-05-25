import { handleCors, jsonResponse, errorResponse } from "../_shared/cors.ts";
import { supabase } from "../_shared/supabase.ts";

Deno.serve(async (req) => {
  const cors = handleCors(req);
  if (cors) return cors;

  try {
    const url = new URL(req.url);
    const locale = url.searchParams.get("locale") ?? "en";

    const { data, error } = await supabase
      .from("profile")
      .select("*")
      .limit(1)
      .single();

    if (error) return errorResponse(error.message, 500);
    if (!data) return errorResponse("Profile not found", 404);

    const result = {
      name: data.name,
      title: locale === "ar" ? data.title_ar : data.title_en,
      bio: locale === "ar" ? data.bio_ar : data.bio_en,
      location: data.location,
      email: data.email,
      avatar_url: data.avatar_url,
      github_url: data.github_url,
      linkedin_url: data.linkedin_url,
      facebook_url: data.facebook_url,
      cv_url: data.cv_url,
    };

    return jsonResponse(result);
  } catch (err) {
    return errorResponse(err.message, 500);
  }
});
