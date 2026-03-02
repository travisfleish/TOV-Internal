import { diffWordsWithSpace } from "diff";

import type { Edit, RedlineSegment, Span } from "@/lib/schema";

type DiffPart = {
  value: string;
  added?: boolean;
  removed?: boolean;
};

type PendingChangeSegment = {
  type: "add" | "del";
  text: string;
  beforeSpan?: Span;
  afterSpan?: Span;
};

const createSpan = (start: number, end: number): Span => ({ start, end });

export function computeEdits(
  originalCopy: string,
  revisedCopy: string
): {
  edits: Edit[];
  segments: RedlineSegment[];
} {
  const diffParts = diffWordsWithSpace(originalCopy, revisedCopy) as DiffPart[];
  const edits: Edit[] = [];
  const segments: RedlineSegment[] = [];

  let idxBefore = 0;
  let idxAfter = 0;
  let editCounter = 0;
  let partIndex = 0;

  while (partIndex < diffParts.length) {
    const part = diffParts[partIndex];
    const value = part.value ?? "";

    if (!part.added && !part.removed) {
      const beforeSpan = createSpan(idxBefore, idxBefore + value.length);
      const afterSpan = createSpan(idxAfter, idxAfter + value.length);
      if (value.length > 0) {
        segments.push({
          type: "same",
          text: value,
          beforeSpan,
          afterSpan
        });
      }
      idxBefore += value.length;
      idxAfter += value.length;
      partIndex += 1;
      continue;
    }

    const changeStartBefore = idxBefore;
    const changeStartAfter = idxAfter;
    let beforeText = "";
    let afterText = "";
    const pendingSegments: PendingChangeSegment[] = [];

    while (partIndex < diffParts.length) {
      const runPart = diffParts[partIndex];
      const runValue = runPart.value ?? "";

      if (!runPart.added && !runPart.removed) break;
      if (runValue.length === 0) {
        partIndex += 1;
        continue;
      }

      if (runPart.removed) {
        const beforeSpan = createSpan(idxBefore, idxBefore + runValue.length);
        pendingSegments.push({
          type: "del",
          text: runValue,
          beforeSpan
        });
        beforeText += runValue;
        idxBefore += runValue.length;
      } else if (runPart.added) {
        const afterSpan = createSpan(idxAfter, idxAfter + runValue.length);
        pendingSegments.push({
          type: "add",
          text: runValue,
          afterSpan
        });
        afterText += runValue;
        idxAfter += runValue.length;
      }

      partIndex += 1;
    }

    if (!beforeText && !afterText) continue;

    editCounter += 1;
    const editId = `edit-${editCounter}`;
    const op: Edit["op"] = beforeText && afterText ? "replace" : beforeText ? "del" : "add";

    edits.push({
      id: editId,
      op,
      beforeText,
      afterText,
      beforeSpan: beforeText ? createSpan(changeStartBefore, idxBefore) : null,
      afterSpan: afterText ? createSpan(changeStartAfter, idxAfter) : null
    });

    for (const pending of pendingSegments) {
      segments.push({
        type: pending.type,
        text: pending.text,
        editId,
        beforeSpan: pending.beforeSpan,
        afterSpan: pending.afterSpan
      });
    }
  }

  return { edits, segments };
}
