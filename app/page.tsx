"use client";

import Image from "next/image";
import { useLayoutEffect, useMemo, useRef, useState } from "react";

import type { Analysis, RedlineSegment, Span } from "@/lib/schema";

type FormState = {
  vertical: "Performance" | "Bet" | "Media";
  regionStyle: "US" | "UK" | "Intl";
  contentType:
    | "Social"
    | "Blog"
    | "SEO Pillar"
    | "Email"
    | "Landing Page"
    | "PR"
    | "Webinar"
    | "Report"
    | "One-pager";
  riskTier: "Low" | "Medium" | "High";
  primaryKeyword: string;
  secondaryKeywords: string;
  audience: string;
  cta: string;
  copy: string;
};

type WorkspaceMode = "analysis" | "copyEditor";

const initialForm: FormState = {
  vertical: "Performance",
  regionStyle: "US",
  contentType: "Blog",
  riskTier: "Medium",
  primaryKeyword: "",
  secondaryKeywords: "",
  audience: "",
  cta: "",
  copy: ""
};

const severityStyles: Record<string, string> = {
  blocker: "bg-red-100 text-red-900",
  high: "bg-orange-100 text-orange-900",
  medium: "bg-yellow-100 text-yellow-900",
  low: "bg-slate-100 text-slate-800"
};

const formatSubScoreLabel = (label: string) =>
  label
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (char) => char.toUpperCase());

const isSpan = (value: unknown): value is Span => {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<Span>;
  return Number.isInteger(candidate.start) && Number.isInteger(candidate.end);
};

const isRedlineSegment = (value: unknown): value is RedlineSegment => {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<RedlineSegment>;
  if (!["same", "add", "del"].includes(candidate.type ?? "")) return false;
  if (typeof candidate.text !== "string") return false;
  if (candidate.editId !== undefined && typeof candidate.editId !== "string") return false;
  if (candidate.beforeSpan !== undefined && !isSpan(candidate.beforeSpan)) return false;
  if (candidate.afterSpan !== undefined && !isSpan(candidate.afterSpan)) return false;
  return true;
};

export default function Page() {
  const [workspaceMode, setWorkspaceMode] = useState<WorkspaceMode>("analysis");
  const [form, setForm] = useState<FormState>(initialForm);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [editorInput, setEditorInput] = useState("");
  const [editorRevisedCopy, setEditorRevisedCopy] = useState("");
  const [editorChangeLog, setEditorChangeLog] = useState<string[]>([]);
  const [editorSegments, setEditorSegments] = useState<RedlineSegment[]>([]);
  const [editorRewriteSource, setEditorRewriteSource] = useState<"llm" | "fallback" | null>(null);
  const [editorView, setEditorView] = useState<"clean" | "redline">("clean");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [editorError, setEditorError] = useState("");
  const [isEditorRewriting, setIsEditorRewriting] = useState(false);
  const [selectedIssueIndex, setSelectedIssueIndex] = useState<number | null>(null);

  // Textarea expand
  const [isCopyExpanded, setIsCopyExpanded] = useState(false);
  const [isEditorExpanded, setIsEditorExpanded] = useState(false);

  // URL import — Analysis panel
  const [urlInput, setUrlInput] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState("");
  const [importedFrom, setImportedFrom] = useState<string | null>(null);

  // URL import — Copy Editor panel
  const [editorUrlInput, setEditorUrlInput] = useState("");
  const [isEditorImporting, setIsEditorImporting] = useState(false);
  const [editorImportError, setEditorImportError] = useState("");
  const [editorImportedFrom, setEditorImportedFrom] = useState<string | null>(null);

  const copyRef = useRef<HTMLTextAreaElement>(null);
  const editorInputRef = useRef<HTMLTextAreaElement>(null);

  // Expand textareas to exact content height when expanded
  useLayoutEffect(() => {
    const ta = copyRef.current;
    if (!ta) return;
    if (isCopyExpanded) {
      ta.style.height = "auto";
      ta.style.height = `${ta.scrollHeight}px`;
    } else {
      ta.style.height = "";
    }
  }, [isCopyExpanded, form.copy]);

  useLayoutEffect(() => {
    const ta = editorInputRef.current;
    if (!ta) return;
    if (isEditorExpanded) {
      ta.style.height = "auto";
      ta.style.height = `${ta.scrollHeight}px`;
    } else {
      ta.style.height = "";
    }
  }, [isEditorExpanded, editorInput]);

  const groupedIssues = useMemo(() => {
    if (!analysis) return { voice: [], seo: [], aeo: [] } as const;
    return {
      voice: analysis.issues.filter((issue) => issue.engine === "voice"),
      seo: analysis.issues.filter((issue) => issue.engine === "seo"),
      aeo: analysis.issues.filter((issue) => issue.engine === "aeo")
    };
  }, [analysis]);

  const redlineSegmentsForRender = useMemo<RedlineSegment[]>(
    () => (editorSegments.length ? editorSegments : [{ type: "same", text: editorRevisedCopy }]),
    [editorSegments, editorRevisedCopy]
  );

  const updateForm = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleAnalyze = async () => {
    setError("");
    setIsAnalyzing(true);
    setSelectedIssueIndex(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          meta: {
            vertical: form.vertical,
            regionStyle: form.regionStyle,
            contentType: form.contentType,
            riskTier: form.riskTier
          },
          primaryKeyword: form.primaryKeyword,
          secondaryKeywords: form.secondaryKeywords,
          audience: form.audience,
          cta: form.cta,
          copy: form.copy
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error ?? "Analysis failed.");
      }
      setAnalysis(data as Analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setForm(initialForm);
    setAnalysis(null);
    setError("");
    setSelectedIssueIndex(null);
  };

  const handleAnalysisUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      updateForm("copy", text);
      setError("");
    } catch {
      setError("Unable to read the uploaded file.");
    } finally {
      event.target.value = "";
    }
  };

  const handleEditorUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      setEditorInput(text);
      setEditorError("");
    } catch {
      setEditorError("Unable to read the uploaded file.");
    } finally {
      event.target.value = "";
    }
  };

  const handleImportUrl = async () => {
    if (!urlInput.trim()) return;
    setImportError("");
    setImportedFrom(null);
    setIsImporting(true);
    try {
      const response = await fetch("/api/import-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlInput.trim() }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error ?? "Import failed.");
      updateForm("copy", data.text);
      setImportedFrom(data.url);
      setError("");
    } catch (err) {
      setImportError(err instanceof Error ? err.message : "Import failed.");
    } finally {
      setIsImporting(false);
    }
  };

  const handleEditorImportUrl = async () => {
    if (!editorUrlInput.trim()) return;
    setEditorImportError("");
    setEditorImportedFrom(null);
    setIsEditorImporting(true);
    try {
      const response = await fetch("/api/import-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: editorUrlInput.trim() }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error ?? "Import failed.");
      setEditorInput(data.text);
      setEditorImportedFrom(data.url);
      setEditorError("");
    } catch (err) {
      setEditorImportError(err instanceof Error ? err.message : "Import failed.");
    } finally {
      setIsEditorImporting(false);
    }
  };

  const handleEditorRewrite = async () => {
    if (!editorInput.trim()) return;
    setEditorError("");
    setIsEditorRewriting(true);

    try {
      const analyzeResponse = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          meta: {
            vertical: form.vertical,
            regionStyle: form.regionStyle,
            contentType: form.contentType,
            riskTier: form.riskTier
          },
          primaryKeyword: form.primaryKeyword,
          secondaryKeywords: form.secondaryKeywords,
          audience: form.audience,
          cta: form.cta,
          copy: editorInput
        })
      });

      const analysisData = await analyzeResponse.json();
      if (!analyzeResponse.ok) {
        throw new Error(analysisData?.error ?? "Unable to analyze editor input.");
      }

      const rewriteResponse = await fetch("/api/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalCopy: editorInput,
          analysis: analysisData,
          stream: true
        })
      });
      if (!rewriteResponse.ok) {
        const rewriteData = await rewriteResponse.json();
        throw new Error(rewriteData?.error ?? "Rewrite failed.");
      }

      const contentType = rewriteResponse.headers.get("content-type") ?? "";
      if (contentType.includes("text/event-stream")) {
        const reader = rewriteResponse.body?.getReader();
        const decoder = new TextDecoder();
        if (!reader) throw new Error("No response body.");
        let buffer = "";
        let revisedCopy = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n\n");
          buffer = lines.pop() ?? "";
          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            try {
              const data = JSON.parse(line.slice(6));
              if (data.chunk != null) {
                revisedCopy += data.chunk;
                setEditorRevisedCopy(revisedCopy);
              }
              if (data.done) {
                setEditorRevisedCopy(data.revisedCopy ?? revisedCopy);
                setEditorChangeLog(Array.isArray(data.changeLog) ? data.changeLog : []);
                setEditorSegments(
                  Array.isArray(data.segments) ? data.segments.filter(isRedlineSegment) : []
                );
                setEditorRewriteSource(
                  data?.meta?.rewriteSource === "llm" || data?.meta?.rewriteSource === "fallback"
                    ? data.meta.rewriteSource
                    : null
                );
              }
              if (data.error) throw new Error(data.error);
            } catch (e) {
              if (e instanceof SyntaxError) continue;
              throw e;
            }
          }
        }
      } else {
        const rewriteData = await rewriteResponse.json();
        setEditorRevisedCopy(rewriteData.revisedCopy ?? "");
        setEditorChangeLog(Array.isArray(rewriteData.changeLog) ? rewriteData.changeLog : []);
        setEditorSegments(Array.isArray(rewriteData.segments) ? rewriteData.segments.filter(isRedlineSegment) : []);
        setEditorRewriteSource(
          rewriteData?.meta?.rewriteSource === "llm" || rewriteData?.meta?.rewriteSource === "fallback"
            ? rewriteData.meta.rewriteSource
            : null
        );
      }
      setEditorView("clean");
    } catch (err) {
      setEditorError(err instanceof Error ? err.message : "Rewrite failed.");
    } finally {
      setIsEditorRewriting(false);
    }
  };

  const exportJson = () => {
    if (!analysis) return;
    const blob = new Blob([JSON.stringify(analysis, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "voice-visibility-analysis.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const jumpToIssue = (index: number) => {
    if (!analysis) return;
    const issue = analysis.issues[index];
    if (!issue?.offsets || !copyRef.current) return;
    copyRef.current.focus();
    copyRef.current.setSelectionRange(issue.offsets.start, issue.offsets.end);
    setSelectedIssueIndex(index);
  };

  return (
    <>
      <section className="pt-0 pb-6 md:pb-8">
        <div className="container fade-in">
          <div className="flex items-start">
            <Image
              src="/brand/genius-logo-full.png"
              alt="Genius Sports"
              width={180}
              height={36}
              className="h-auto w-[130px] sm:w-[180px]"
              priority
            />
          </div>
          <div className="mt-7 text-center">
            <h1 className="mt-0 mb-3 text-[2.45rem] leading-tight md:text-[2.65rem]">Voice + Visibility QA</h1>
            <p className="mb-0 mx-auto max-w-3xl opacity-90">
              Analyze marketing copy for brand tone integrity, search performance, and answer-engine readiness.
            </p>
          </div>
        </div>
      </section>

      <section className="pt-2 md:pt-3 pb-8 md:pb-10">
        <div className="container">
          <div className="mb-8 md:mb-10 flex justify-center">
            <div
              className="inline-flex items-center overflow-hidden rounded-md border"
              style={{ borderColor: "var(--color-navy)" }}
            >
            <button
              type="button"
                className="px-6 py-2.5 text-base font-medium transition-colors"
                style={
                  workspaceMode === "analysis"
                    ? { background: "var(--color-blue)", color: "var(--color-white)" }
                    : { background: "var(--color-white)", color: "var(--color-navy)" }
                }
              onClick={() => setWorkspaceMode("analysis")}
                aria-pressed={workspaceMode === "analysis"}
            >
              Analysis
            </button>
            <button
              type="button"
                className="border-l px-6 py-2.5 text-base font-medium transition-colors"
                style={
                  workspaceMode === "copyEditor"
                    ? { borderColor: "var(--color-navy)", background: "var(--color-blue)", color: "var(--color-white)" }
                    : { borderColor: "var(--color-navy)", background: "var(--color-white)", color: "var(--color-navy)" }
                }
              onClick={() => setWorkspaceMode("copyEditor")}
                aria-pressed={workspaceMode === "copyEditor"}
            >
              Copy Editor
            </button>
            </div>
          </div>

          {workspaceMode === "analysis" ? (
            <>
              {error ? (
                <div className="card mb-6 border-l-4" style={{ borderLeftColor: "var(--color-orange)" }}>
                  <strong>Something went wrong.</strong>
                  <p className="mb-0">{error}</p>
                </div>
              ) : null}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card fade-in">
                  <h3 className="mt-0">Inputs</h3>

              <div className="form-group">
                <label>Vertical</label>
                <div className="flex flex-col gap-2">
                  {(["Performance", "Bet", "Media"] as const).map((item) => (
                    <button
                      key={item}
                      type="button"
                      className={`button ${form.vertical === item ? "button-primary" : "button-outline"}`}
                      onClick={() => updateForm("vertical", item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="regionStyle">Region style</label>
                <select
                  id="regionStyle"
                  value={form.regionStyle}
                  onChange={(e) => updateForm("regionStyle", e.target.value as FormState["regionStyle"])}
                >
                  <option>US</option>
                  <option>UK</option>
                  <option>Intl</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="contentType">Content type</label>
                <select
                  id="contentType"
                  value={form.contentType}
                  onChange={(e) => updateForm("contentType", e.target.value as FormState["contentType"])}
                >
                  {["Social", "Blog", "SEO Pillar", "Email", "Landing Page", "PR", "Webinar", "Report", "One-pager"].map(
                    (type) => (
                      <option key={type}>{type}</option>
                    )
                  )}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="riskTier">Risk tier</label>
                <select
                  id="riskTier"
                  value={form.riskTier}
                  onChange={(e) => updateForm("riskTier", e.target.value as FormState["riskTier"])}
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="primaryKeyword">Primary keyword</label>
                <input
                  id="primaryKeyword"
                  value={form.primaryKeyword}
                  onChange={(e) => updateForm("primaryKeyword", e.target.value)}
                  placeholder="e.g. sports fan engagement platform"
                />
              </div>

              <div className="form-group">
                <label htmlFor="secondaryKeywords">Secondary keywords (comma separated)</label>
                <input
                  id="secondaryKeywords"
                  value={form.secondaryKeywords}
                  onChange={(e) => updateForm("secondaryKeywords", e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="audience">Audience (role/title)</label>
                <input id="audience" value={form.audience} onChange={(e) => updateForm("audience", e.target.value)} />
              </div>

              <div className="form-group">
                <label htmlFor="cta">CTA</label>
                <input id="cta" value={form.cta} onChange={(e) => updateForm("cta", e.target.value)} />
              </div>

                  <div className="form-group">
                    <label htmlFor="analysisUpload">Upload copy file</label>
                    <input id="analysisUpload" type="file" accept=".txt,.md,.csv,text/plain,text/markdown" onChange={handleAnalysisUpload} />
                  </div>

                  <div className="form-group">
                    <label htmlFor="analysisUrlInput">Import via link</label>
                    <div className="flex gap-2">
                      <input
                        id="analysisUrlInput"
                        type="url"
                        value={urlInput}
                        onChange={(e) => { setUrlInput(e.target.value); setImportError(""); }}
                        placeholder="https://example.com/article"
                        className="flex-1"
                      />
                      <button
                        type="button"
                        className="button button-outline"
                        onClick={handleImportUrl}
                        disabled={isImporting || !urlInput.trim()}
                        style={{ minWidth: "6rem" }}
                      >
                        {isImporting ? "Importing…" : "Import"}
                      </button>
                    </div>
                    {importError && (
                      <p className="mt-1 mb-0 text-sm" style={{ color: "var(--color-orange)" }}>{importError}</p>
                    )}
                    {importedFrom && !importError && (
                      <p className="mt-1 mb-0 text-sm" style={{ color: "var(--color-navy)", opacity: 0.6 }}>
                        Imported from {importedFrom}
                      </p>
                    )}
                  </div>

                  <div className="form-group">
                    <div className="flex items-center justify-between mb-2">
                      <label htmlFor="copy" className="mb-0">Copy</label>
                      {form.copy.trim() && (
                        <button
                          type="button"
                          className="text-sm font-medium"
                          style={{ color: "var(--color-blue)" }}
                          onClick={() => setIsCopyExpanded((v) => !v)}
                        >
                          {isCopyExpanded ? "Collapse" : "Expand"}
                        </button>
                      )}
                    </div>
                    <textarea
                      ref={copyRef}
                      id="copy"
                      value={form.copy}
                      onChange={(e) => updateForm("copy", e.target.value)}
                      className="min-h-[260px]"
                      placeholder="Paste marketing copy here..."
                    />
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button className="button button-primary" onClick={handleAnalyze} disabled={isAnalyzing || !form.copy.trim()}>
                      {isAnalyzing ? "Analyzing..." : "Analyze"}
                    </button>
                    <button className="button button-secondary" onClick={handleReset}>
                      Reset
                    </button>
                  </div>
                </div>

                <div className="card fade-in">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-3">
                      <Image
                        src="/brand/genius-logo-g.png"
                        alt="Genius G mark"
                        width={28}
                        height={28}
                        className="h-7 w-7"
                      />
                      <h3 className="mt-0 mb-0">Results</h3>
                    </div>
                    <button className="button button-outline" onClick={exportJson} disabled={!analysis}>
                      Export JSON
                    </button>
                  </div>

              {!analysis ? (
                <p className="mt-6 mb-0">Run analysis to see Voice, SEO, and AEO scoring with issue breakdowns.</p>
              ) : (
                <div className="mt-6 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="card !p-4">
                      <p className="mb-1">Voice</p>
                      <div className="stat-compact">{analysis.scores.voice.total}</div>
                    </div>
                    <div className="card !p-4">
                      <p className="mb-1">SEO</p>
                      <div className="stat-compact">{analysis.scores.seo.total}</div>
                    </div>
                    <div className="card !p-4">
                      <p className="mb-1">AEO</p>
                      <div className="stat-compact">{analysis.scores.aeo.total}</div>
                    </div>
                  </div>

                  <div className="card !p-4">
                    <p className="mb-1">Overall score</p>
                    <div className="stat-compact">{analysis.scores.overall}</div>
                  </div>

                  <div>
                    <h4 className="mt-0">Sub-scores</h4>
                    <ul className="my-2 space-y-3 list-none p-0">
                      {([
                        { label: "Voice", subs: analysis.scores.voice.subs },
                        { label: "SEO", subs: analysis.scores.seo.subs },
                        { label: "AEO", subs: analysis.scores.aeo.subs }
                      ] as const).map((group) => (
                        <li key={group.label} className="card !p-4">
                          <p className="mb-2 font-semibold">{group.label}</p>
                          <ul className="m-0 p-0 list-none space-y-1">
                            {Object.entries(group.subs).map(([key, value]) => (
                              <li key={key} className="flex items-start justify-between gap-3 min-w-0">
                                <span className="min-w-0 break-words">{formatSubScoreLabel(key)}</span>
                                <span className="shrink-0 font-semibold">{value}</span>
                              </li>
                            ))}
                          </ul>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {(["voice", "seo", "aeo"] as const).map((engine) => (
                    <div key={engine}>
                      <h4 className="mt-0">{engine.toUpperCase()} issues</h4>
                      {groupedIssues[engine].length === 0 ? (
                        <p>No major issues detected.</p>
                      ) : (
                        <ul className="space-y-3 list-none p-0 m-0">
                          {groupedIssues[engine].map((issue) => {
                            const globalIndex = analysis.issues.findIndex(
                              (i) => i.title === issue.title && i.engine === issue.engine && i.severity === issue.severity
                            );
                            const snippet =
                              issue.offsets && form.copy
                                ? form.copy.slice(Math.max(issue.offsets.start - 30, 0), issue.offsets.end + 30).trim()
                                : "";
                            return (
                              <li key={`${issue.title}-${globalIndex}`} className="card !p-4">
                                <div className="flex items-center justify-between gap-2">
                                  <strong>{issue.title}</strong>
                                  <span
                                    className={`rounded-full px-2 py-1 text-xs font-semibold ${severityStyles[issue.severity]}`}
                                  >
                                    {issue.severity}
                                  </span>
                                </div>
                                <p className="mb-2">{issue.explanation}</p>
                                <p className="mb-2">
                                  <strong>Suggestion:</strong> {issue.suggestion}
                                </p>
                                {issue.offsets ? (
                                  <div>
                                    <button className="button button-outline" onClick={() => jumpToIssue(globalIndex)}>
                                      Jump to phrase
                                    </button>
                                    {snippet ? (
                                      <p
                                        className={`mt-2 mb-0 text-sm ${
                                          selectedIssueIndex === globalIndex ? "font-semibold" : "opacity-90"
                                        }`}
                                      >
                                        Snippet: “…{snippet}…”
                                      </p>
                                    ) : null}
                                  </div>
                                ) : null}
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  ))}

                  <div>
                    <h4 className="mt-0">Quick fixes</h4>
                    {analysis.quickFixes.length ? (
                      <ul>
                        {analysis.quickFixes.map((fix) => (
                          <li key={fix}>{fix}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>No quick fixes generated.</p>
                    )}
                  </div>

                  <div>
                    <h4 className="mt-0">Risky claims</h4>
                    <ul>
                      {analysis.notes.riskyClaims.length ? (
                        analysis.notes.riskyClaims.map((risk) => <li key={risk}>{risk}</li>)
                      ) : (
                        <li>None detected.</li>
                      )}
                    </ul>
                  </div>

                  <div>
                    <h4 className="mt-0">Assumptions to confirm</h4>
                    <ul>
                      {analysis.notes.assumptionsToConfirm.length ? (
                        analysis.notes.assumptionsToConfirm.map((assumption) => <li key={assumption}>{assumption}</li>)
                      ) : (
                        <li>None detected.</li>
                      )}
                    </ul>
                  </div>

                </div>
              )}
                </div>
              </div>
            </>
          ) : (
            <>
              {editorError ? (
                <div className="card mb-6 border-l-4" style={{ borderLeftColor: "var(--color-orange)" }}>
                  <strong>Something went wrong.</strong>
                  <p className="mb-0">{editorError}</p>
                </div>
              ) : null}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card fade-in">
                  <h3 className="mt-0">Copy editor input</h3>
                  <div className="form-group">
                    <label htmlFor="editorUpload">Upload copy file</label>
                    <input id="editorUpload" type="file" accept=".txt,.md,.csv,text/plain,text/markdown" onChange={handleEditorUpload} />
                  </div>

                  <div className="form-group">
                    <label htmlFor="editorUrlInput">Import via link</label>
                    <div className="flex gap-2">
                      <input
                        id="editorUrlInput"
                        type="url"
                        value={editorUrlInput}
                        onChange={(e) => { setEditorUrlInput(e.target.value); setEditorImportError(""); }}
                        placeholder="https://example.com/article"
                        className="flex-1"
                      />
                      <button
                        type="button"
                        className="button button-outline"
                        onClick={handleEditorImportUrl}
                        disabled={isEditorImporting || !editorUrlInput.trim()}
                        style={{ minWidth: "6rem" }}
                      >
                        {isEditorImporting ? "Importing…" : "Import"}
                      </button>
                    </div>
                    {editorImportError && (
                      <p className="mt-1 mb-0 text-sm" style={{ color: "var(--color-orange)" }}>{editorImportError}</p>
                    )}
                    {editorImportedFrom && !editorImportError && (
                      <p className="mt-1 mb-0 text-sm" style={{ color: "var(--color-navy)", opacity: 0.6 }}>
                        Imported from {editorImportedFrom}
                      </p>
                    )}
                  </div>

                  <div className="form-group">
                    <div className="flex items-center justify-between mb-2">
                      <label htmlFor="editorInput" className="mb-0">Paste copy</label>
                      {editorInput.trim() && (
                        <button
                          type="button"
                          className="text-sm font-medium"
                          style={{ color: "var(--color-blue)" }}
                          onClick={() => setIsEditorExpanded((v) => !v)}
                        >
                          {isEditorExpanded ? "Collapse" : "Expand"}
                        </button>
                      )}
                    </div>
                    <textarea
                      id="editorInput"
                      value={editorInput}
                      onChange={(e) => setEditorInput(e.target.value)}
                      ref={editorInputRef}
                      className="min-h-[320px]"
                      placeholder="Paste copy here or upload a file..."
                    />
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      className="button button-primary"
                      onClick={handleEditorRewrite}
                      disabled={isEditorRewriting || !editorInput.trim()}
                    >
                      {isEditorRewriting ? "Rewriting..." : "Rewrite to fix issues"}
                    </button>
                    <button
                      className="button button-secondary"
                      onClick={() => {
                        setEditorInput("");
                        setEditorRevisedCopy("");
                        setEditorChangeLog([]);
                        setEditorSegments([]);
                        setEditorRewriteSource(null);
                        setEditorError("");
                      }}
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="card fade-in">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <h3 className="mt-0 mb-0">Revised copy</h3>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className={`button ${editorView === "clean" ? "button-primary" : "button-outline"}`}
                        onClick={() => setEditorView("clean")}
                        disabled={!editorRevisedCopy}
                      >
                        Normal
                      </button>
                      <button
                        type="button"
                        className={`button ${editorView === "redline" ? "button-primary" : "button-outline"}`}
                        onClick={() => setEditorView("redline")}
                        disabled={!editorRevisedCopy}
                      >
                        Redline
                      </button>
                    </div>
                  </div>

                  {!editorRevisedCopy ? (
                    <p className="mb-0 mt-4">Run rewrite to view revised copy and change highlights.</p>
                  ) : editorView === "clean" ? (
                    <div className="form-group mt-4">
                      <label htmlFor="editorRevisedCopy">Revised draft</label>
                      <textarea
                        id="editorRevisedCopy"
                        value={editorRevisedCopy}
                        onChange={(e) => setEditorRevisedCopy(e.target.value)}
                        className="min-h-[320px]"
                      />
                    </div>
                  ) : (
                    <div className="mt-4 rounded-md border p-4 leading-7 whitespace-pre-wrap">
                      {redlineSegmentsForRender.map((segment, index) => {
                          if (segment.type === "add") {
                            return (
                              <ins key={`add-${index}`} className="bg-green-100 no-underline">
                                {segment.text}
                              </ins>
                            );
                          }
                          if (segment.type === "del") {
                            return (
                              <del key={`del-${index}`} className="bg-red-100">
                                {segment.text}
                              </del>
                            );
                          }
                          return <span key={`same-${index}`}>{segment.text}</span>;
                        })}
                    </div>
                  )}

                  {editorRewriteSource ? (
                    <p className="mt-3 mb-0 text-sm opacity-75">Rewrite source: {editorRewriteSource}</p>
                  ) : null}

                  {editorChangeLog.length ? (
                    <div className="mt-4">
                      <h4 className="mt-0">Change log</h4>
                      <ul>
                        {editorChangeLog.map((item, index) => (
                          <li key={`${item}-${index}`}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
