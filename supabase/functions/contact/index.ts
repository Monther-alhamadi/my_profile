import { handleCors, jsonResponse, errorResponse } from "../_shared/cors.ts";
import { supabaseAdmin } from "../_shared/supabase.ts";

Deno.serve(async (req) => {
  const cors = handleCors(req);
  if (cors) return cors;

  if (req.method !== "POST") {
    return errorResponse("Method not allowed", 405);
  }

  try {
    const body = await req.json();

    const { name, email, projectType, message } = body;

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return errorResponse("Name, email, and message are required");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return errorResponse("Invalid email format");
    }

    const { error } = await supabaseAdmin
      .from("contact_messages")
      .insert({
        name: name.trim(),
        email: email.trim(),
        subject: projectType && projectType !== "none" ? projectType : null,
        message_type: projectType && projectType !== "none" ? projectType : null,
        message: message.trim(),
      });

    if (error) return errorResponse(error.message, 500);

    return jsonResponse({ success: true, message: "Message sent successfully" }, 201);

  } catch (err) {
    return errorResponse(err.message, 500);
  }
});
