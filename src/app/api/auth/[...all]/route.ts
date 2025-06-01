import { toNextJsHandler } from "better-auth/next-js";

import { auth } from "@/lib/auth";

// Add error logging middleware
const handler = toNextJsHandler(auth);

export async function POST(req: Request) {
  try {
    const result = await handler.POST(req);
    return result;
  } catch (error) {
    console.error("Auth API Error:", {
      url: req.url,
      error:
        error instanceof Error
          ? {
              message: error.message,
              stack: error.stack,
              name: error.name,
            }
          : error,
    });

    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}

export async function GET(req: Request) {
  try {
    const result = await handler.GET(req);
    return result;
  } catch (error) {
    console.error("Auth API Error:", {
      url: req.url,
      error:
        error instanceof Error
          ? {
              message: error.message,
              stack: error.stack,
              name: error.name,
            }
          : error,
    });

    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
