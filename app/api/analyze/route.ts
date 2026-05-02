import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { image } = await req.json();

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "API Key Required for Real Analysis." }, { status: 401 });
    }

    // 1. Check Base64 Encoding
    let base64Data = image;
    if (image.includes("base64,")) {
      base64Data = image.split("base64,")[1];
    }

    // 2. Size Validation (20MB Limit)
    const estimatedSizeMB = (base64Data.length * 3) / 4 / (1024 * 1024);
    if (estimatedSizeMB > 20) {
      return NextResponse.json({ error: "File too large for analysis" }, { status: 413 });
    }

    // 3. Updated System Prompt
    const payload = {
      contents: [
        {
          parts: [
            {
              text: "Analyze this image. It is either a prescription or a medication box. Extract: Drug Name, Dosage, and Safety Warning. If you cannot find medical data, return: {'error': 'No medicine detected'}. Do not hallucinate. Format response as JSON using these keys: 'medication_name', 'usage_instructions', 'safety_flag'.",
            },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: base64Data,
              },
            },
          ],
        },
      ],
    };

    const callGemini = async (modelName: string) => {
      // 5. Timeout Handling: 30 seconds
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);
      
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            signal: controller.signal,
          }
        );
        clearTimeout(timeoutId);
        return response;
      } catch (err) {
        clearTimeout(timeoutId);
        throw err;
      }
    };

    let response;
    try {
      // Primary Call to Pro Model
      response = await callGemini("gemini-1.5-pro-latest");
      
      // 4. Model Fallback to Flash Model on 503 or 429
      if (!response.ok && (response.status === 429 || response.status === 503)) {
        console.warn(`[Fallback] Gemini Pro returned ${response.status}. Trying Gemini Flash...`);
        response = await callGemini("gemini-1.5-flash-latest");
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
         return NextResponse.json({ error: "Request timed out after 30 seconds. Please try again." }, { status: 504 });
      }
      throw err;
    }

    if (!response.ok) {
      // Enhanced Error Logging
      const errorText = await response.text();
      console.error("Gemini API Error response:", errorText);
      return NextResponse.json({ error: "Failed to analyze image with Gemini." }, { status: 500 });
    }

    const data = await response.json();
    let jsonStr = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!jsonStr) {
       throw new Error("No output from Gemini");
    }

    // Clean markdown if present
    jsonStr = jsonStr.replace(/```json/g, "").replace(/```/g, "").trim();
    
    let result;
    try {
      result = JSON.parse(jsonStr);
    } catch (parseErr) {
      console.error("Failed to parse Gemini JSON:", jsonStr);
      throw parseErr;
    }

    // Handle the specific 'error' response from the prompt
    if (result.error) {
      return NextResponse.json({
        medication_name: 'Unknown',
        usage_instructions: 'No medical data found',
        safety_flag: result.error,
        is_valid: false
      });
    }
    
    // Determine is_valid based on medication_name
    result.is_valid = result.medication_name && result.medication_name !== 'Unknown';

    return NextResponse.json(result);
  } catch (error) {
    console.error("Unhandled Error in /api/analyze:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
