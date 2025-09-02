import { NextResponse } from "next/server";
import openai from "@/lib/openai";
import { sql } from "@/lib/db";
import { buildRecipePrompt } from "@/lib/prompt";

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const maybeFile = formData.get("file");

        if (!(maybeFile instanceof File)) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const text = await maybeFile.text();
        const prompt = buildRecipePrompt(text);

        const completion = await openai.chat.completions.create({
            model: process.env.OPEN_AI_COMPLETION_MODEL || "gpt-4o-mini",
            response_format: prompt.response_format,
            messages: prompt.messages,
            temperature: 0
        });

        console.log(completion)
        const parsed = completion.choices[0].message?.content;

        console.log(parsed)

        if (!parsed) {
            return NextResponse.json({ error: "No JSON returned" }, { status: 502 });
        }

        // Insert into DB
        const inserted =
            await sql`INSERT INTO extracted_data (data) VALUES (${parsed}) RETURNING id, created_at;`;

        return NextResponse.json({ id: inserted[0].id, data: parsed });
    } catch (err: any) {
        console.error("upload error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
