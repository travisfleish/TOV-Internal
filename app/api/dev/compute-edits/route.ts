import { NextResponse } from "next/server";
import { z } from "zod";

import { computeEdits } from "@/lib/redline/computeEdits";

const requestSchema = z.object({
  originalCopy: z.string(),
  revisedCopy: z.string()
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = requestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid compute-edits payload", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    return NextResponse.json(computeEdits(parsed.data.originalCopy, parsed.data.revisedCopy));
  } catch {
    return NextResponse.json(
      { error: "Unable to compute edits at this time." },
      { status: 500 }
    );
  }
}
