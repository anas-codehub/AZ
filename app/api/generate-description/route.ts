// app/api/generate-description/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, category, keywords } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Product name is required" }, { status: 400 });
    }

    // Gemini-র জন্য একটি সুন্দর প্রম্পট তৈরি করা
    const prompt = `You are a professional fashion copywriter for a premium clothing brand called "ANSUZITA". 
    Write a compelling, elegant, and persuasive product description for the following product. 
    Keep it concise (around 2-3 paragraphs). Use sophisticated language suitable for a high-end fashion brand.
    
    Product Name: ${name}
    Category: ${category || "Fashion"}
    Key Features: ${keywords || "Premium quality, elegant design"}
    
    Do not include any extra formatting like "Here is your description:". Just output the description text directly.`;

    // Gemini API-তে রিকোয়েস্ট পাঠানো (REST API ব্যবহার করে)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API Error:", data);
      throw new Error("Failed to generate description");
    }

    // Gemini-র রেসপন্স থেকে টেক্সট বের করা
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      throw new Error("No text generated");
    }

    return NextResponse.json({ description: generatedText.trim() });
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    return NextResponse.json({ error: error.message || "Something went wrong" }, { status: 500 });
  }
}