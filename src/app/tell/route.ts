import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // Await params to prevent sync access errors
  //const { prompt } = context.params;

  // if (!prompt) {
  //   return NextResponse.json({ error: 'Prompt is missing' }, { status: 400 });
  // }
  //console.log('Received prompt:', req);
  //console.log('Received prompt:', prompt);
  try {
    const { searchParams } = new URL(req.url);
    const prompt = searchParams.get('prompt');
    console.log('Prompt received:', prompt);
    if (prompt) {
      const genAI = new GoogleGenerativeAI(process.env.API_KEY as string);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      // const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${process.env.API_KEY}`,
      //   },
      //   body: JSON.stringify({
      //     prompt: prompt,
      //     max_tokens: 100,
      //     temperature: 0.7,
      //   }),
      // });
      const result = await model.generateContent(prompt);
      console.log(result.response.text());
      const data = result.response.text();
      return NextResponse.json({ text: data }, { status: 200 });
    } else {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error fetching response:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export function POST() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}