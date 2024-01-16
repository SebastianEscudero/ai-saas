import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources";
import { increaseApiLimit, checkApiLimit } from "@/lib/api-limit";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const masterPrompt: ChatCompletionMessageParam = {
    role: "system",
    content: "You are a code generator. You must answer only in markdown code snippets. Use code comments for explanations."
}

export async function POST(
    req: Request,
) {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { messages } = body;

        if (!userId) {
            return new NextResponse("Unauthorized", {status: 401})
        }

        if (!openai.apiKey) {
            return new NextResponse("OpenAI API Key not configured", {status: 401})
        }

        if (!messages) {
            return new NextResponse("Messages are required", {status: 400})
        }

        const freeTrial = await checkApiLimit();

        if (!freeTrial) {
            return new NextResponse("Free trial limit exceeded", {status: 403})
        }

        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [masterPrompt, ...messages]
        })
        
        await increaseApiLimit();

        return NextResponse.json(response.choices[0].message)

    } catch (error) {
        console.log("[CODE_ERROR]", error);
        return new NextResponse("Internal Error", {status: 500})
    }
}