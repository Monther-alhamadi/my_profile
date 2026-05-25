import { handleCors, jsonResponse, errorResponse } from "../_shared/cors.ts";
import { supabase } from "../_shared/supabase.ts";

Deno.serve(async (req) => {
  const cors = handleCors(req);
  if (cors) return cors;

  try {
    const url = new URL(req.url);
    const locale = url.searchParams.get("locale") ?? "en";
    const id = url.searchParams.get("id");

    if (id) {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .eq("locale", locale)
        .single();

      if (error) return errorResponse("Project not found", 404);
      return jsonResponse(data);
    }

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("locale", locale)
      .order("sort_order", { ascending: true });

    if (error) return errorResponse(error.message, 500);
    return jsonResponse(data);

  } catch (err) {
    return errorResponse(err.message, 500);
  }
});
