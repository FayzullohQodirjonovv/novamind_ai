import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, image } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `Sen yordamchi AI assistantisan. Javoblaringni quyidagi qoidalarga asoslanib ber:

1. QISQA va TUSHUNARLI javoblar ber
2. Har doim EMOJI ishlatgin: 🔥 ✅ 🚀 ⚡ 👇 ✨ 🧠 ⚠️
3. Javobni bo'limlarga bo'l (1-3 qator har bo'lim)
4. Foydalanuvchini MAQTOV bilan boshlang
5. Maksimal 3-5 bo'lim
6. AKADEMIK, zerikarli matnlar YO'Q
7. Oxirida savollar yoki takliflar ber

Ideal struktura:
🔥 Zo'r urinish!
Keling, tez va tushunarli qilib ko'ramiz 👇

✅ [Asosiy javob]
⚠️ [E'tibor berish kerak]
🧠 [Esda tutish kerak]
🚀 [Keyingi qadam]`;

    const apiMessages = [
      { role: "system", content: systemPrompt },
      ...messages.map((msg: { role: string; content: string }) => ({
        role: msg.role,
        content: image && msg.role === "user" && messages.indexOf(msg) === messages.length - 1
          ? [
              { type: "text", text: msg.content },
              { type: "image_url", image_url: { url: image } }
            ]
          : msg.content
      }))
    ];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: apiMessages,
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Juda ko'p so'rov. Biroz kuting va qayta urinib ko'ring." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Kredit tugadi. Hisobingizga kredit qo'shing." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI xatosi yuz berdi" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Noma'lum xato" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
