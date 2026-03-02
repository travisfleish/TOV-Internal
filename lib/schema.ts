import { z } from "zod";

export const metaSchema = z.object({
  vertical: z.enum(["Performance", "Bet", "Media"]),
  regionStyle: z.enum(["US", "UK", "Intl"]),
  contentType: z.enum([
    "Social",
    "Blog",
    "SEO Pillar",
    "Email",
    "Landing Page",
    "PR",
    "Webinar",
    "Report",
    "One-pager"
  ]),
  riskTier: z.enum(["Low", "Medium", "High"])
});

export const issueSchema = z.object({
  engine: z.enum(["voice", "seo", "aeo"]),
  severity: z.enum(["blocker", "high", "medium", "low"]),
  title: z.string().min(1),
  explanation: z.string().min(1),
  suggestion: z.string().min(1),
  offsets: z
    .object({
      start: z.number().int().nonnegative(),
      end: z.number().int().positive()
    })
    .optional()
});

export const analysisSchema = z.object({
  meta: metaSchema,
  scores: z.object({
    voice: z.object({
      total: z.number().min(0).max(100),
      subs: z.object({
        evidenceLedAuthority: z.number().min(0).max(25),
        precisionClarity: z.number().min(0).max(20),
        commercialGrounding: z.number().min(0).max(15),
        sportNative: z.number().min(0).max(10),
        responsibilityCompliance: z.number().min(0).max(20),
        globalClarity: z.number().min(0).max(10)
      })
    }),
    seo: z.object({
      total: z.number().min(0).max(100),
      subs: z.object({
        intentAlignment: z.number().min(0).max(25),
        structureHeadings: z.number().min(0).max(20),
        keywordUse: z.number().min(0).max(20),
        coverageCompleteness: z.number().min(0).max(20),
        internalLinking: z.number().min(0).max(15)
      })
    }),
    aeo: z.object({
      total: z.number().min(0).max(100),
      subs: z.object({
        directAnswerClarity: z.number().min(0).max(30),
        snippetReadyBlocks: z.number().min(0).max(25),
        faqQuality: z.number().min(0).max(25),
        entityClarity: z.number().min(0).max(20)
      })
    }),
    overall: z.number().min(0).max(100)
  }),
  issues: z.array(issueSchema),
  quickFixes: z.array(z.string()),
  notes: z.object({
    assumptionsToConfirm: z.array(z.string()),
    riskyClaims: z.array(z.string())
  })
});

export const analyzeRequestSchema = z.object({
  meta: metaSchema,
  primaryKeyword: z.string().trim().optional().default(""),
  secondaryKeywords: z.string().trim().optional().default(""),
  audience: z.string().trim().optional().default(""),
  cta: z.string().trim().optional().default(""),
  copy: z.string().min(1, "Copy is required")
});

export const rewriteRequestSchema = z.object({
  originalCopy: z.string().min(1),
  analysis: analysisSchema
});

export const rewriteResponseSchema = z.object({
  revisedCopy: z.string(),
  changeLog: z.array(z.string())
});

export type AnalyzeRequest = z.infer<typeof analyzeRequestSchema>;
export type Analysis = z.infer<typeof analysisSchema>;
export type Issue = z.infer<typeof issueSchema>;
export type RewriteRequest = z.infer<typeof rewriteRequestSchema>;
export type RewriteResponse = z.infer<typeof rewriteResponseSchema>;
