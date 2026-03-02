/* eslint-disable no-console */

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";

async function postJson(path, payload) {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const body = await response.json();
  if (!response.ok) {
    throw new Error(`${path} failed (${response.status}): ${JSON.stringify(body)}`);
  }
  return body;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function run() {
  const originalCopy = "American football is one of the most powerful sports";
  const revisedCopy = "American football is a significant sport";
  const rewrite = await postJson("/api/dev/compute-edits", {
    originalCopy,
    revisedCopy
  });

  const replaceEdits = Array.isArray(rewrite.edits)
    ? rewrite.edits.filter((edit) => edit.op === "replace")
    : [];

  assert(replaceEdits.length >= 1, "Expected at least one replace edit.");
  const segments = Array.isArray(rewrite.segments) ? rewrite.segments : [];
  for (const edit of replaceEdits) {
    const relatedSegments = segments.filter((segment) => segment.editId === edit.id);
    const hasDel = relatedSegments.some((segment) => segment.type === "del");
    const hasAdd = relatedSegments.some((segment) => segment.type === "add");
    assert(hasDel && hasAdd, `Expected both del/add segments to share editId ${edit.id}.`);
  }

  const significantAdd = segments.find((segment) => segment.type === "add" && segment.text.includes("significant"));
  assert(Boolean(significantAdd?.editId), "Expected an added 'significant' segment with an editId.");

  console.log("Harness passed.");
  console.log(
    JSON.stringify(
      {
        replaceEditCount: replaceEdits.length,
        significantEditId: significantAdd.editId
      },
      null,
      2
    )
  );
}

run().catch((error) => {
  console.error("Harness failed:", error.message);
  process.exit(1);
});
