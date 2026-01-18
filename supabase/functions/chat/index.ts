import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    let body: unknown;

    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Yaroqsiz JSON body yuborildi" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const { messages, image } = (body ?? {}) as {
      messages?: { role: string; content: string }[];
      image?: string | null;
    };

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "messages massivini yuborish kerak" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `
    Sen "Artificial" nomli sun'iy intellekt yordamchisan.
    
    ━━━━━━━━━━━━━━━━━━
    🌍 TIL QOIDALARI:
    ━━━━━━━━━━━━━━━━━━
    Foydalanuvchi qaysi tilda yozsa — o‘sha tilda javob ber:
    - Uzbek → Uzbekcha
    - English → English
    - Russian → Русский
    
    ━━━━━━━━━━━━━━━━━━
    🎨 JAVOB USLUBI:
    ━━━━━━━━━━━━━━━━━━
    1) Qisqa, aniq, tez hazm bo‘ladigan
    2) Zerikarli akademik tekst YO‘Q
    3) Har javobda kamida 2–3 emoji: 🔥 🚀 ✨ ⚡ 👇 🧠
    4) Juda uzun paragraf yozma (3–4 qatordan oshmasin)
    5) Doimo foydalanuvchini ruhlantir: "Yaxshi urinish!", "Zo‘r savol!" 💪
    
    ━━━━━━━━━━━━━━━━━━
    📦 STRUKTURA:
    ━━━━━━━━━━━━━━━━━━
    Har javob quyidagi formatga yaqin bo‘lishi kerak:
    
    🔥 Intro (maqtov yoki qisqa motivatsiya)
    ✅ Asosiy javob
    🧠 Kichik tushuntirish / misol
    ⚠️ E’tibor berish kerak bo‘lgan joy (agar bo‘lsa)
    🚀 Keyingi qadam / taklif
    
    Misol:
    🔥 Zo'r savol!
    Keling, tez tushuntirib beraman 👇
    
    ━━━━━━━━━━━━━━━━━━
    📚 XATOLARNI TUZATISH:
    ━━━━━━━━━━━━━━━━━━
    Agar foydalanuvchi xato qilsa:
    - Muloyim tarzda tuzat
    - Hech qachon keskin gapirma
    
    Format:
    "Yaxshi urinish, lekin bu yerda kichik xato bor 🔍"
    Keyin to‘g‘ri shaklni yoz yoki tushuntir.
    
    ━━━━━━━━━━━━━━━━━━
    🎯 MAQSAD:
    ━━━━━━━━━━━━━━━━━━
    Har javob foydali, qisqa, real yordam beruvchi bo‘lsin.
    Hech qachon ortiqcha akademik “lecture mode”ga o‘tma.
    `;
    

    // messages -> OpenAI format (with optional image on last user message)
    const apiMessages: any[] = [{ role: "system", content: systemPrompt }];

    messages.forEach((msg, index) => {
      const isLastUser =
        msg.role === "user" && index === messages.length - 1 && image;

      if (isLastUser) {
        apiMessages.push({
          role: msg.role,
          content: [
            { type: "text", text: msg.content },
            { type: "image_url", image_url: { url: image } },
          ],
        });
      } else {
        apiMessages.push({
          role: msg.role,
          content: msg.content,
        });
      }
    });

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
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
      },
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({
            error: "Juda ko'p so'rov. Biroz kuting va qayta urinib ko'ring.",
          }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }

      if (response.status === 402) {
        return new Response(
          JSON.stringify({
            error: "Kredit tugadi. Hisobingizga kredit qo'shing.",
          }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }

      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);

      return new Response(JSON.stringify({ error: "AI xatosi yuz berdi" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Streaming'ni to'g'ridan-to'g'ri uzatamiz
    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(
      JSON.stringify({
        error:
          error instanceof Error ? error.message : "Noma'lum xato yuz berdi",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
