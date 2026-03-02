"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";

import type { Analysis } from "@/lib/schema";

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

export default function Page() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [revisedCopy, setRevisedCopy] = useState("");
  const [changeLog, setChangeLog] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRewriting, setIsRewriting] = useState(false);
  const [error, setError] = useState("");
  const [selectedIssueIndex, setSelectedIssueIndex] = useState<number | null>(null);

  const copyRef = useRef<HTMLTextAreaElement>(null);

  const groupedIssues = useMemo(() => {
    if (!analysis) return { voice: [], seo: [], aeo: [] } as const;
    return {
      voice: analysis.issues.filter((issue) => issue.engine === "voice"),
      seo: analysis.issues.filter((issue) => issue.engine === "seo"),
      aeo: analysis.issues.filter((issue) => issue.engine === "aeo")
    };
  }, [analysis]);

  const updateForm = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleAnalyze = async () => {
    setError("");
    setIsAnalyzing(true);
    setSelectedIssueIndex(null);
    setRevisedCopy("");
    setChangeLog([]);

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

  const handleRewrite = async () => {
    if (!analysis) return;
    setError("");
    setIsRewriting(true);
    try {
      const response = await fetch("/api/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalCopy: form.copy,
          analysis
        })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error ?? "Rewrite failed.");
      }
      setRevisedCopy(data.revisedCopy ?? "");
      setChangeLog(Array.isArray(data.changeLog) ? data.changeLog : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Rewrite failed.");
    } finally {
      setIsRewriting(false);
    }
  };

  const handleReset = () => {
    setForm(initialForm);
    setAnalysis(null);
    setRevisedCopy("");
    setChangeLog([]);
    setError("");
    setSelectedIssueIndex(null);
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
      <section className="section">
        <div className="container fade-in">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <Image
                src="/brand/genius-logo-full.png"
                alt="Genius Sports"
                width={220}
                height={44}
                className="h-auto w-[180px] sm:w-[220px] mb-4"
                priority
              />
              <h1 className="mt-0">Voice + Visibility QA</h1>
              <p className="mb-0 max-w-3xl opacity-90">
                Analyze marketing copy for brand tone integrity, search performance, and answer-engine readiness.
              </p>
            </div>
            <span
              className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
              style={{ background: "var(--color-blue)", color: "var(--color-white)" }}
            >
              Beta
            </span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
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
                <label htmlFor="copy">Copy editor</label>
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
                <button className="button button-outline" onClick={handleRewrite} disabled={!analysis || isRewriting}>
                  {isRewriting ? "Rewriting..." : "Rewrite to fix issues"}
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

                  {revisedCopy ? (
                    <div className="form-group">
                      <label htmlFor="revisedCopy">Revised draft</label>
                      <textarea id="revisedCopy" value={revisedCopy} onChange={(e) => setRevisedCopy(e.target.value)} />
                      {changeLog.length ? (
                        <ul className="mt-3">
                          {changeLog.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
