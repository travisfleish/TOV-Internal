2# Genius Sports AEO Execution Blueprint

## Method, scope, and what this analysis can and cannot verify

This blueprint customizes the attached AEO Playbook to Genius Sports’ real, current web footprint and the way answer engines assemble responses from public web sources. fileciteturn0file0  

Primary sources for this analysis include Genius Sports’ marketing site and product pages (geniussports.com), its investor relations site (investors.geniussports.com), SEC filings (EDGAR), and high-authority third-party references that answer engines frequently cite (e.g., Wikipedia and league/news outlets). citeturn14view0turn32view1turn21view0turn5search0turn26view9

Because Google AI Overviews, Bing Copilot, and Perplexity outputs aren’t directly queryable from here, “answer engine simulation” is based on (a) what reliably ranks for representative conversational queries, and (b) what sources are structurally most “citable” and commonly used by answer engines (Wikipedia/Knowledge Graph, SEC filings, league sites, Business Wire, major trade outlets). This approach is directionally accurate for narrative control and AEO planning, but you should validate with an internal prompt-monitoring workflow (defined in the roadmap) once implementation begins. citeturn5search0turn21view0turn26view9turn36view0

## Company and product landscape findings

### Public web properties and indexable surface area

Genius’ public footprint is large and fragmented across marketing, investor, API/developer, and numerous application/log-in subdomains. The ones most relevant to AEO (because they can be crawled, indexed, and cited) are:

| Property | What it appears to be used for | AEO relevance and risks |
|---|---|---|
| `https://www.geniussports.com/` | Primary marketing site positioning and product navigation (Perform / Engage / Bet / GeniusIQ / Data Capture / Sports Data API). citeturn14view0turn14view1 | Critical. This is where Genius should “own the definition” of its entity and products for answer engines. Current messaging is broad and multi-category (good for breadth, risky for entity crispness). citeturn14view0turn35view2 |
| `https://investors.geniussports.com/` | Investor relations, press releases, financial results (Q4 platform). citeturn4search5turn36view0 | Extremely high authority for “how does Genius make money / profitability / segments” queries; currently more extractable than the marketing newsroom for many announcements. citeturn32view1turn36view0 |
| `https://developer.geniussports.com/` | Developer center / reference docs for APIs. citeturn4search11 | High AEO value for “API / integration / docs” queries if it’s kept clean, canonical, and indexable where appropriate. |
| `https://sportsdata.api.geniussports.com/docs/...` and `https://statistics.api.geniussports.com/docs/...` | API documentation portals. citeturn4search15turn4search23 | High AEO value for technical buyers; also a risk if documentation pages outrank product narratives and don’t reinforce entity/product naming. |
| Numerous app/login subdomains (e.g., auth portals) | Customer/admin portals. citeturn4search4turn4search12 | Should generally be non-indexable. Indexation dilutes trust and can confuse LLM retrieval. |

**Blunt finding:** there are signs of indexable non-marketing environments. For example, an “uat.arena.geniussports.com Managed WordPress Site” page (“Hello world!”) appears crawlable in search results. That is brand- and trust-negative in AI answers because low-quality indexed pages can be retrieved and summarized. citeturn9search0turn9search10

### How Genius positions itself

Genius’ public positioning varies by surface:

* Marketing homepage: “Genius Sports delivers cutting-edge sports data, analytics & tech solutions to enhance performance, engage fans & optimise betting.” citeturn2search10turn14view0  
* Marketing “About”: founded in London in 2001 as a betting data specialist; now “one of the world’s largest sports technology companies.” citeturn16view5  
* Investor “About us”: “Genius Sports is the layer between what happens on the field and how the world engages with it,” underpinned by GeniusIQ. citeturn26view5  
* SEC prospectus-style language: “Genius is a business-to-business provider of scalable, technology-led products and services to the sports, sports betting and sports media industries,” with a mission tied to official data/technology/commercial partnership powering the ecosystem. citeturn33view9  
* Wikipedia’s concise definition emphasizes data management, video streaming, and integrity services. citeturn5search0  

**AEO implication:** answer engines prefer stable, repeated, self-contained definitional language. Today, Genius has several good definitions, but they are not standardized into a single canonical “entity definition” repeated across key pages (and mirrored on Wikipedia/major third parties). citeturn14view0turn26view5turn33view9turn5search0

### Product families, on-site proof, and what Genius actually claims

Below is a product-family inventory aligned to your requested categories (Sportsbooks/Betting; Media/Broadcast; Advertising/Programmatic; Data/Integrity; Fan Engagement; Streaming; League/Federation solutions; Data rights). Product names/descriptions are taken directly from Genius pages and/or authoritative filings.

| Product family (your framework) | What Genius sells (official naming + how it’s described) | Primary buyer | Differentiators / proof on the site | Named integrations & partners surfaced |
|---|---|---|---|---|
| Sportsbooks / Betting | **Bet** hub: “Smarter trading. Next-gen betting.” built around Data & Odds APIs, Genius Trading Services (GTS), and BetVision. citeturn14view1turn16view0turn16view2 | Sportsbook COO/GM, Head of Trading/Risk, Product, Marketing | Data & Odds APIs include measurable claims like “99%+ in-play market uptime” for EPL 2024 season. citeturn16view1 GTS claims Edge delivers a “22% margin increase” on football markets in 2025/26 season. citeturn35view8 BetVision includes a clean “What is BetVision?” block (highly citable). citeturn35view9 | NFL official data distribution is a central “official” proof point (exclusive distributor language appears in league comms). citeturn26view9turn6search2 Infront partnership appears in BetVision tennis launch comms. citeturn30search12 |
| Media & Broadcast | **Engage** includes “Augmentation” and “Create immersive viewing experiences” positioning. citeturn15view0 **Perform** also emphasizes turning data into “video or visualisations.” citeturn14view6turn33view4 | Broadcasters, content owners, league media teams | Messaging is strong but often lacks page-level “productized” definitions (what exactly is Augmentation, what modules exist, what inputs/outputs). citeturn15view0turn33view4 | Second Spectrum referenced in league comms as powering NFL broadcast augmentation engine. citeturn26view9turn2search11 |
| Advertising / Programmatic | **FANHub**: “Fan-optimised programmatic and social media buying, audience activation, and creative personalisation - all in one omni-channel platform.” citeturn33view2 Subpages include Media Buying with a strong FAQ defining “programmatic advertising in sports.” citeturn26view2 | Brands, agencies, sportsbook marketers, rights holders selling inventory | Good “sports-first” differentiation and dynamic creative tied to live sports data (“real-time scores, player stats, and highlights”). citeturn35view0 FANHub:ID is framed as “privacy-compliant” identity resolution built for sports. citeturn16view3turn11search2 | Investor comms explicitly mention iSpot measurement integration into FANHub. citeturn36view0 (Recent) Moment Engine is referenced in adtech integration news. citeturn5search1 |
| Data & Integrity | Integrity is positioned both as a market-facing capability and a product section inside **Perform**: “monitor bets 24/7, educate the industry, run audits…” citeturn34view0turn35view6 Integrity also appears heavily in investor press releases (NCAA agreement includes expanded integrity safeguards). citeturn32view1 | Leagues/federations, regulators, integrity units | Strong “why it matters” pitch (protect sport, protect athletes) but weak productization: there is no obvious, standalone, SEO/AEO-optimized Integrity product hub comparable to Bet or Engage. citeturn34view0turn30search30 | IBIA partnership is a major credibility signal (but the marketing newsroom version appears non-extractable in our crawl, while search snippets show content exists). citeturn30search1turn27view0 |
| Fan Engagement | **Engage** positioning: “Reach fans in the moment…” and includes Gamification (“capture valuable behavioural and demographic insights”). citeturn15view0turn16view8 | Teams/leagues, broadcasters, brands | Good clarity about outcomes (data capture, monetizable IP) but still lacks durable “how it works” diagrams and buyer decision frameworks that answer engines can lift. citeturn16view8turn15view0 | Often tied to broader FANHub + official data ecosystem (NCAA LiveStats + GeniusIQ + fan experiences). citeturn32view1turn34view0 |
| Streaming | BetVision explicitly merges “ultra-low latency live streams” with betting interactivity. citeturn16view0turn35view9 SEC filings also describe a “streaming product” for leagues that can produce/distribute/commercialize audio-visual content. citeturn35view4 | Sportsbooks; leagues wanting to monetize video; broadcasters | The streaming story is split across sportsbook narrative (BetVision) vs league narrative (streaming product in filings). That split creates answer-engine ambiguity: “Is Genius a streaming provider?” gets inconsistent answers. citeturn35view9turn35view4turn5search0 | Infront partnership (tennis) and league rights agreements are key “official” anchors. citeturn30search12turn32view1 |
| League/Federation solutions | **Data Capture**: “Get the best tracking data… AI-powered capture of rich tracking data or robust software for play-by-play event data.” citeturn33view3 **Perform** includes “Digitise your sporting administration” (competition/member management) and NCAA LiveStats newsletter. citeturn34view0 | League ops, competition admins, federation IT/data | Strong product breadth, but naming is inconsistent versus investor “Sports Technology & Services.” Also, many case studies appear thin/non-extractable (risk to proof). citeturn23view0turn24view0turn33view3 | NCAA LiveStats is repeatedly referenced; press release states LiveStats remains free and covers 70,000+ games/year. citeturn32view1turn34view0 |
| Data rights | Investor press release: Genius as exclusive distributor of official NCAA post-season data to licensed sportsbooks through 2032; links official data feeds + marks via AGL program. citeturn32view1 NFL comms: exclusive distributor of official NFL data feeds and official sports betting data feed. citeturn26view9turn6search2 | Leagues; sportsbooks needing “official” | This is one of Genius’ strongest defensible differentiators—yet it’s not centralized into a single “Official Data Rights & Distribution” explainer page on the marketing domain (high AEO opportunity). citeturn26view9turn32view1 | NFL.com and NCAA press releases are high-authority “third-party citations” that can be leveraged with strong internal cross-linking and canonical pages. citeturn26view9turn32view1 |

### Revenue model signals (what answer engines will cite for “how Genius makes money”)

Answer engines answering “How does Genius Sports make money?” will default to SEC filings and investor results because they’re structured, authoritative, and quote-ready.

In the FY2023 Form 20‑F, Genius reports three major revenue product lines—Betting Technology, Content and Services; Media Technology, Content and Services; Sports Technology and Services—with a revenue split table for 2023/2022/2021. citeturn35view3  

That same filing explains (in plain language) that Betting revenue is primarily generated via official sports data for betting plus outsourced bookmaking services, while Media revenue is primarily generated via data-driven performance marketing technology/services. citeturn22view0turn22view1

**Blunt AEO takeaway:** if Genius does not publish (on its marketing domain) a clean, current, non-investor “How we work / how we make money (at a high level)” explainer, then third parties will define it—often with simplified, sometimes negative framing (e.g., “data rights owner,” “betting enabler,” “integrity conflict-of-interest”). citeturn5search0turn6news50turn36view0

## Answer-engine footprint and narrative risk

### What sources dominate key query clusters

Below is the practical “citation battlefield” for the queries you listed—based on which sources are most authoritative and most likely to be retrieved/cited.

| Query cluster (examples) | Domains answer engines are most likely to cite | Does Genius “own” the narrative today? | Narrative risks and gaps |
|---|---|---|---|
| “What is Genius Sports?” | Wikipedia definition; Genius About; SEC/IR “About”; investor press release boilerplate. citeturn5search0turn16view5turn33view9turn32view1 | Partially. There are decent definitions, but not one canonical repeated “entity definition.” citeturn14view0turn33view9 | Wikipedia omits or underplays newer pillars (fan activation platform, adtech depth), so AI answers can skew toward “betting data + integrity.” citeturn5search0turn13search0 |
| “Who owns official NFL betting data?” / “Who distributes official NFL betting data?” | NFL.com statement (exclusive distributor); SportsPro / trade coverage; Genius partnership posts. citeturn26view9turn6search13turn6search2 | Strong, because NFL.com is high authority and explicitly names Genius. citeturn26view9 | If Genius doesn’t provide a canonical “Official NFL data distribution explained” page, AI answers may still cite league sources but won’t send traffic back to Genius. |
| “Genius Sports vs Sportradar” / “Alternatives to Sportradar” | Comparison/competitor list sites (CB Insights, etc.), trade press, finance blogs. citeturn6search0turn6search13turn6search10 | Weak. Genius does not appear to have a neutral, high-quality comparison hub that could be cited. | Competitors and third parties define category criteria; Genius’ differentiators (official rights, BetVision, FANHub) may not be stated in the evaluative language buyers use. citeturn35view9turn33view2turn32view1 |
| “Best sports data providers” / “sports data API providers” | Generic SEO lists and dev sites; some omit Genius or give it shallow coverage. citeturn6search4turn6search8 | Mixed. Genius has an “Official Sports Data API” page, but it’s positioned for engagement rather than developer procurement evaluation. citeturn26view0 | If listicles omit Genius, AI answers built on them will too—especially for non-enterprise buyers. Genius needs a canonical “Sports Data API for enterprises” explainer with clear scope, licensing constraints, and integration patterns. citeturn26view0turn4search11 |
| “How does Genius Sports make money?” / “Is Genius Sports profitable?” | Investor results and SEC filings; finance/news recaps. citeturn36view0turn21view0turn35view3 | Investor site dominates (good for authority). Marketing site contributes little. | Profitability answers can skew negative because headlines emphasize “net loss” even when adjusted EBITDA grows (e.g., investor release explicitly shows both). citeturn36view0 |
| Integrity / “Is Genius Sports an integrity monitor?” | League integrity announcements; Genius investor releases; Wikipedia; investigative narratives. citeturn32view1turn5search0turn6news50 | Not controlled. Genius has integrity messaging on Perform, but not organized as a product story with methodology and governance transparency. citeturn34view0turn35view6 | High narrative risk: integrity + betting + data rights can be framed as a conflict. The New Yorker explicitly raises conflicts for data/integrity providers. citeturn6news50 |

### Where Genius currently wins AI citations

Genius is strongest where it has **clean definitional blocks and FAQ-style Q&A** on product pages—because those are directly extractable.

Examples:
* BetVision includes an explicit “What is BetVision?” section with a crisp answer. citeturn35view9  
* Data & Odds APIs and GTS pages include FAQs framed as direct questions, with definitional answers that are likely to be reused in AI answers. citeturn35view7turn35view8  
* FANHub Media Buying includes a long-form answer to “What is programmatic advertising in sports and how does it work?” which is exactly how conversational search is phrased. citeturn26view2  

### Where third-party narratives outrank Genius

Genius loses narrative control in three recurring scenarios:

First, when the query is **evaluative or comparative** (“best providers,” “alternatives to…,” “vs Sportradar”), third-party lists dominate. citeturn6search0turn6search4  

Second, when the query is **financial or governance-oriented**, investor/SEC sources dominate and marketing pages rarely appear. This is not “bad,” but it means the brand story is told in finance language, not buyer language. citeturn35view3turn36view0  

Third, when the content lives on the marketing newsroom/case study hub, **the pages often appear thin/non-extractable in our crawl**, while investor duplicates are richly extractable (suggesting a rendering/indexation architecture problem that can depress AEO performance). citeturn32view0turn32view1turn25view0

## Entity clarity, terminology, and on-site extractability audit

### Entity clarity and naming consistency

Genius has a real entity clarity problem: it is simultaneously a sports data company, an official data rights distributor, a betting technology provider, an adtech activation platform, and a league performance/tracking provider. All are true—but answer engines reward **one primary definition and stable subordinate entity relationships**.

Concrete inconsistencies and confusion vectors:
* Two overlapping sportsbook hubs: `https://www.geniussports.com/bet/` (“Bet”) and `https://www.geniussports.com/sportsbooks/` (“Sportsbooks”), both pitching Data & Odds APIs + GTS + BetVision. This increases duplication, weakens canonical signals, and can confuse LLM retrieval. citeturn14view1turn33view1  
* FANHub naming varies (FANHub, FanHub:ID, “FANHub:ID”), creating multiple near-entities for the same product family. citeturn33view2turn16view3turn26view2  
* Streaming is split: BetVision is clearly “streaming + betting interactivity,” while SEC filings describe a broader league streaming product. Without a canonical streaming taxonomy, “Does Genius offer streaming?” will be inconsistently answered. citeturn35view9turn35view4turn5search0  

**Immediate fix:** publish and reuse a “Genius Sports is…” canonical definition and a “Genius products taxonomy” page that maps: Genius Sports → GeniusIQ platform → (Bet / Engage / Perform / Data Capture / APIs / Integrity). Reinforce the same taxonomy in navigation labels, page H1s, and (where possible) structured data.

### Top-page extractability scorecard

Scoring scale: 1 (poor) to 5 (excellent). “Citation likelihood” reflects how easily an answer engine can quote or paraphrase a passage while preserving accuracy and confidence.

| Page | URL (real) | Extractability | Clarity | Trust | Entity precision | Citation likelihood | What’s working / what’s missing |
|---|---|---:|---:|---:|---:|---:|---|
| Homepage | `https://www.geniussports.com/` | 2 | 3 | 3 | 2 | 3 | Strong breadth (“performance / fan activation / betting”), but not a clean, single definitional answer for “what is Genius Sports.” citeturn14view0turn35view2 |
| Bet hub | `https://www.geniussports.com/bet/` | 4 | 4 | 4 | 4 | 4 | Clear product list and outcomes; good stats and structure. citeturn14view1turn33view0 |
| BetVision | `https://www.geniussports.com/bet/bet-vision/` | 5 | 5 | 4 | 4 | 5 | Best-in-class “What is BetVision?” block and concrete capability list. citeturn35view9 |
| Data & Odds APIs | `https://www.geniussports.com/bet/odds-feeds-api/` | 5 | 4 | 4 | 4 | 5 | FAQ-style definitional answer engines can lift; includes quantified uptime claim. citeturn16view1turn35view7 |
| Genius Trading Services | `https://www.geniussports.com/bet/genius-trading-services/` | 5 | 4 | 4 | 4 | 5 | Strong “What is GTS?” + quantified Edge impact. Needs sourcing/method context for the 22% claim. citeturn35view8 |
| Engage hub | `https://www.geniussports.com/engage/` | 4 | 4 | 3 | 3 | 4 | Clear audience framing and product buckets. “World’s first sport-focused media activation platform” is strong but needs proof/citations and precise module naming. citeturn15view0turn35view1 |
| FANHub hub | `https://www.geniussports.com/engage/fanhub/` | 4 | 4 | 3 | 3 | 4 | Solid definition and capability list; missing explicit “what data sources / what inventory types / what measurement integrations” table. citeturn33view2turn35view0 |
| FANHub Media Buying | `https://www.geniussports.com/engage/fanhub/media-buying/` | 5 | 4 | 4 | 3 | 5 | Excellent “question → answer” explanation of sports programmatic and moment-triggered ads; add integrations list and compliance table to raise trust. citeturn26view2turn33view6 |
| Data Capture | `https://www.geniussports.com/data-capture/` | 4 | 4 | 4 | 4 | 4 | Clear system definition (“computer vision system,” “digital twin”), plus concrete adoption scale claims. Needs a standardized “what is mesh tracking” definition block. citeturn33view3turn14view5 |
| Perform | `https://www.geniussports.com/perform/` | 4 | 3 | 4 | 3 | 4 | Strong quantified “surface data points / times a second” and an Integrity section exists. Needs cleaner separation of sub-products (Performance Studio, SAOT, league admin, integrity) into individually citable modules. citeturn33view4turn34view0 |
| GeniusIQ | `https://www.geniussports.com/geniusiq/` | 4 | 4 | 3 | 4 | 4 | Very clear “GeniusIQ is…” definition; good platform framing. Needs concrete examples and an “inputs → outputs” unit to improve trust/citability. citeturn33view5turn26view5 |

### High-impact structural issue: investor pages are more “extractable” than marketing newsroom/case studies

A major AEO red flag: multiple marketing-domain press release and customer story pages appear to contain little extractable body copy in our crawl (headers, navigation, footer), while investor-domain equivalents contain rich bullet points and full narratives.

Example: NCAA partnership.
* Marketing newsroom version appears thin (headline + related links + footer). citeturn32view0  
* Investor release contains bullet-point summary, definitions, and plain-English detail (exclusive NCAA data through 2032; LiveStats is free; 70,000+ games; GeniusIQ integration; integrity safeguards). citeturn32view1  

**AEO consequence:** answer engines using non-JS crawlers or lightweight renderers may ignore or underweight the marketing newsroom/case study content—and cite investor pages instead (or third parties). That’s lost commercial opportunity and weaker top-of-funnel control.

## Competitive AEO landscape and gaps

### What competitors do better (in ways that win AI citations)

Competitors tend to win citations by:
* **Owning a single, ultra-simple company definition** that is repeated everywhere.
* Publishing “category pages” that define the market and the buyer’s decision criteria.
* Providing quantified scale claims with specifics.

Examples:
* Sportradar’s homepage states: “Sportradar is the world’s leading sports technology company, at the intersection between sports, media and betting.” This is short, quotable, and entity-clear. citeturn10search0  
* Stats Perform front-loads “trusted Opta sports data and AI” and provides very specific scale metrics on Opta content (petabytes of data, competitions covered). citeturn10search1turn10search9  
* Nielsen Sports stakes a clear territory (“leading source of sports measurement and analytics…”) with named solution areas. citeturn10search2turn10search6  

### Where Genius is actually ahead (but not always in citable packaging)

Genius has unusually strong **quantified performance claims** and **FAQ-based answer formatting** in key commercial product areas:
* 99%+ in-play market uptime claim for EPL season (Data & Odds APIs). citeturn16view1  
* Edge delivering 22% margin increase (GTS). citeturn35view8  
* “What is BetVision?” block is near-perfect for answer engines. citeturn35view9  
* FANHub Media Buying provides an unusually complete definition of sports programmatic, including live-event-triggered ads. citeturn26view2  

**Blunt competitive gap:** Genius is not consistently packaging these strengths into canonical, category-defining pages that answer engines use for “best provider / comparison / how it works / limitations.” That’s why third-party lists still dominate for “alternatives” queries. citeturn6search0turn6search4

## Genius-specific AEO strategy and product-level blueprints

### Executive strategy summary

**Where Genius stands now**
Genius has strong AEO foundations on several product pages (BetVision, Data & Odds APIs, GTS, FANHub Media Buying) because those pages contain direct Q&A blocks and measurable claims. citeturn35view9turn35view7turn35view8turn26view2  
But it underperforms on: entity clarity, marketing newsroom/case study extractability, and category/comparison coverage (where third parties define Genius and its competitors). citeturn14view0turn6search0turn32view0turn25view0

**Biggest risks in AI answers**
* Integrity/conflict narratives can surface when AI systems summarize sports betting controversies; major journalism explicitly frames data/integrity providers as conflicted. citeturn6news50  
* Profitability answers can skew negative unless Genius supplies clear “net loss vs adjusted EBITDA” context; investor releases show the tension directly. citeturn36view0  
* Duplicative/fragmented product hubs (Bet vs Sportsbooks; multiple FANHub naming forms) can confuse retrieval and reduce canonical authority. citeturn14view1turn33view1turn16view3  
* Indexable low-quality environments (e.g., UAT WordPress “Hello world”) can undermine trust. citeturn9search0turn9search10  

**Biggest opportunities**
* Consolidate Genius’ entity narrative into a single definitional “spine” that can be cited in “What is Genius Sports?” answers.
* Turn official data rights (NFL/NCAA) into a canonical on-site explainer hub that’s written for buyers and answer engines, not just press releases. citeturn26view9turn32view1  
* Rebuild newsroom/case studies into fully server-rendered, extractable narratives with metrics and “how it works” sections.

### Top AEO fixes by impact

These are ordered for **citation lift + narrative control**, not generic SEO.

**Fix the extractability architecture for newsroom + case studies (highest impact).**  
If marketing newsroom pages remain thin while investor pages carry the real story, Genius will keep losing commercial narrative ownership. The NCAA example shows investor pages are richly extractable while marketing pages are not. citeturn32view0turn32view1  

**Pick one canonical sportsbook hub and 301/canonicalize the other.**  
Right now, `/bet/` and `/sportsbooks/` overlap heavily. Choose one (prefer `/bet/` since it’s already a product family in navigation) and canonicalize/redirect the other to prevent split authority. citeturn14view1turn33view1  

**Publish a “Genius Sports is…” definition block on every top-level product hub.**  
The best-performing pages already do this for BetVision and APIs; replicate the pattern for Engage, Perform, Data Capture, and the company homepage. citeturn35view9turn35view1turn33view4turn33view3  

**Create a canonical “Official data rights & distribution” hub.**  
Own queries like “official NFL betting data,” “official NCAA March Madness data,” “what does official mean,” “how licensing works,” “latency and verification.” Anchor it with citations and link out to NFL.com and NCAA releases. citeturn26view9turn32view1  

**Create a canonical “Integrity Services” hub with governance transparency.**  
Perform has an integrity section, but it’s embedded. Build a standalone, citable integrity narrative: methods, monitoring approach, marketplace coverage, separation of duties, case examples. Use IBIA partnership and NCAA integrity safeguards as credibility anchors. citeturn35view6turn30search1turn32view1  

**Standardize product naming across all mentions (FANHub, FANHub:ID, etc.).**  
Pick one public-facing name and a clear module naming system; add “also known as” language once, then keep it consistent. citeturn33view2turn16view3turn26view2  

**Build “comparison pages” that answer engines can cite.**  
You do not need attack pages. You need neutral buyer guides: “How to choose a sports data provider,” “Genius vs Sportradar: what to compare,” “managed trading vs in-house,” “official vs unofficial data.” Third-party lists dominate because Genius doesn’t publish these in its own voice. citeturn6search0turn6search4turn35view7turn35view8  

**Turn quantified claims into cite-safe claims.**  
You already publish powerful numbers (99% uptime; 22% margin increase). Add methodology notes (time period, definition, what’s excluded) so AI answers can reuse them without risking misrepresentation. citeturn16view1turn35view8  

**Clean up indexable non-marketing environments.**  
UAT and stray “Hello world” pages should be removed or noindexed to prevent retrieval poisoning. citeturn9search0turn9search10  

**Add “limitations / constraints” sections to high-risk pages.**  
For example: data rights are jurisdiction-dependent; integrity monitoring depends on access to regulated market data; identity solutions must be privacy compliant. This reduces overclaim risk and increases trust. citeturn35view3turn16view3turn6news50  

### Product-level AEO blueprints (ready to implement)

Each blueprint includes: canonical definition block, ideal structure, extractable units, and query fan-out (primary + 10 buyer + 5 implementation + 5 risk + 5 comparison queries). Use these as templates inside your QA tool.

#### Sportsbooks / Betting blueprint (Bet: Data & Odds APIs, GTS, BetVision, MultiBet)

**Canonical “What is it?” block to publish (copy-ready)**  
Genius Sports’ **Bet** solutions are end-to-end sportsbook technologies that combine **official real-time sports data and low-latency odds**, **managed trading and risk tools**, and **interactive in-play streaming experiences** to improve uptime, betting engagement, and sportsbook profitability. citeturn14view1turn35view7turn35view9  

**Ideal page structure (Bet hub)**
1) 2–3 sentence definition + “Who it’s for” (Sportsbooks; B2B platforms)  
2) Module cards with explicit “What is X?” blocks (Data & Odds APIs; GTS; BetVision; MultiBet) citeturn14view1turn33view0  
3) Proof unit: uptime / margin / coverage table (time-bound) citeturn16view1turn35view8  
4) Integration unit: sportsbook platform integration patterns (API, feed, managed service) citeturn35view7turn35view8  
5) “Official data” explainer (what official means; why it matters) anchored to NFL/NCAA rights pages citeturn26view9turn32view1  
6) Buyer FAQ + implementation FAQ + risk FAQ + comparison FAQ (below)

**Required extractable units to add**
A “Sportsbook solution selector” matrix (In-house trading vs managed trading; data-only vs full stack; video-enabled vs not). A one-page integration timeline (“Week 1–2: technical discovery…”) and a compliance/rights table (“available leagues vary by jurisdiction/contract”).

**Query fan-out set**
Primary: “What sportsbook solutions does Genius Sports offer?”  
Secondary buyer questions: “What are official data feeds?”; “How does low latency impact in-play betting?”; “What leagues are covered?”; “How does betbuilder work?”; “What is MultiBet?”; “How do you improve market uptime?”; “How do you price odds?”; “What sportsbooks use Genius?”; “How does BetVision increase engagement?”; “What’s included in managed trading?”  
Implementation: “How do I integrate Data & Odds APIs?”; “What does onboarding to GTS look like?”; “What SDKs/webhooks are available?”; “How do you handle latency and failover?”; “How do you deploy BetVision in a sportsbook app?” citeturn35view7turn35view8turn35view9  
Risk/limitations: “What if I already have a trading team?”; “What markets are restricted by jurisdiction?”; “What data rights limitations apply?”; “What happens during data outages?”; “How do you prevent integrity issues?” citeturn35view8turn35view6turn35view3  
Comparisons: “Genius Sports vs Sportradar for official data”; “GTS vs in-house trading”; “BetVision vs standard in-play streaming”; “Official vs unofficial sportsbook data”; “Managed trading vs outsourced bookmaking”

#### Advertising / Programmatic blueprint (FANHub, FANHub:ID, Dynamic Creative, Media Buying)

**Canonical “What is it?” block to publish (copy-ready)**  
**FANHub** is Genius Sports’ omni-channel sports advertising and activation platform that combines **sports-optimized media buying**, **fan audience activation/identity**, and **data-driven dynamic creative** so brands and sportsbooks can reach fans with the right message at the right moment. citeturn33view2turn35view0turn26view2  

**Ideal page structure**
1) 2–3 sentence definition + “built for” (brands, agencies, sportsbooks, rights holders) citeturn33view2turn35view1  
2) Module definitions: Media Buying; Dynamic Creative; FANHub:ID (each with one-paragraph “what it is”) citeturn33view6turn16view3turn35view0  
3) Trust unit: privacy/compliance (cookie strategy, consent, data handling) anchored to privacy-compliant language already present citeturn16view3turn11search2turn11search7  
4) Integrations unit: measurement + SSP/DSP + social platforms; explicitly include iSpot integration (currently only in investor comms) citeturn36view0  
5) Proof unit: outcome metrics with methodology (e.g., CPA deltas, CTR deltas) citeturn15view0turn26view2  
6) FAQ architecture (below)

**Required extractable units to add**
A “Data sources & activation” table (first-party league/team data, contextual signals, identity resolution signals) + “Supported channels” table (CTV, DOOH, display, social, audio), since the Media Buying page already references these but not in a scannable unit. citeturn26view2

**Query fan-out set**  
Primary: “What is FANHub?”  
Secondary buyer questions: “How is sports programmatic different?”; “What inventory do you access?”; “What is FANHub:ID?”; “How do you target without third-party cookies?”; “How do you trigger ads by live sports moments?”; “What reporting do you provide?”; “Can you run managed service?”; “What sports/regions are supported?”; “How do you measure outcomes?”; “What’s your advantage vs generic DSPs?” citeturn26view2turn16view3  
Implementation: “How do we onboard data?”; “How do we set up segments?”; “What integrations are required?”; “How do we QA dynamic creative templates?”; “How does iSpot measurement integration work?” citeturn36view0turn35view0  
Risk/limitations: “What privacy constraints apply?”; “What data is not available?”; “How do you avoid brand safety issues?”; “What are identity match-rate limitations?”; “What jurisdictions restrict targeting?” citeturn16view3turn11search7  
Comparisons: “FANHub vs The Trade Desk for sports”; “FANHub:ID vs generic identity graphs”; “Managed service vs self-serve”; “Dynamic creative vs static creative”; “Sports-first DSP vs general DSP”

#### Media & Broadcast blueprint (Augmentation, alt-casts, data-driven graphics)

**Canonical “What is it?” block to publish (copy-ready)**  
Genius Sports’ **broadcast augmentation** solutions use real-time official data and AI to generate **contextual graphics, insights, and interactive viewing modes** that help fans understand the game and create new sponsorship inventory during key moments. citeturn15view0turn26view9turn36view0  

**Ideal page structure**
1) “What is broadcast augmentation?” definition (one paragraph)  
2) “Inputs” (tracking, event data, Next Gen Stats feeds) and “outputs” (graphics overlays, clips, alt-cast feeds)  
3) Sponsorship inventory formats (AR graphics, moment-triggered sponsor units)  
4) Case examples with measurable outcomes  
5) FAQ architecture

**Required extractable units to add**
An “Augmentation unit catalog” table (e.g., shot probability, win probability, player tracking overlays) and a “rights & data requirements” table (what data feed is needed for each).

**Query fan-out set**
Primary: “What is broadcast augmentation in live sports?”  
Secondary buyer questions: “What data do you need?”; “What teams/leagues use it?”; “How does it create sponsorship inventory?”; “What is an alt-cast?”; “How does AI generate graphics in real time?”; “What latency is required?”; “Can it work for regional sports networks?”; “What’s the difference between tracking and event data?”; “How do you integrate with production workflows?”; “How do you measure impact?” citeturn26view9turn33view4turn14view5turn36view0  
Implementation: “What integrations with broadcast graphics systems exist?”; “How do we QA data accuracy?”; “What’s the deployment timeline per venue?”; “What’s required for alternate telecasts?”; “How do you handle redundancy?”  
Risk/limitations: “What if tracking isn’t available?”; “What if data rights restrict use?”; “How do you avoid misleading graphics?”; “How do you handle officiating controversies?”; “What’s the failure mode when feeds drop?”  
Comparisons: “Genius augmentation vs Second Spectrum vs in-house”; “Data-driven graphics vs manual graphics”; “Alt-cast vs traditional broadcast”; “Official vs unofficial overlays”; “Augmentation vs highlights automation”

#### Data & Integrity blueprint (monitoring, audits, education, integrity intelligence)

**Canonical “What is it?” block to publish (copy-ready)**  
Genius Sports **Integrity Services** help leagues and federations protect competitions from betting-related corruption by combining **24/7 bet monitoring**, **integrity education**, and **investigations/audit practices** designed to detect suspicious patterns and strengthen safeguards. citeturn35view6turn32view1turn30search1  

**Ideal page structure**
1) Definition + “who it’s for”  
2) Monitoring methodology (sources, coverage, alerts, investigations workflow)  
3) Governance and separation-of-duties (address conflict narratives head-on) citeturn6news50  
4) Partner ecosystem (e.g., IBIA sharing/transparency) citeturn30search1  
5) Case examples (anonymized, aggregated) + metrics  
6) FAQ architecture

**Required extractable units to add**
A “What we monitor / what we don’t monitor” table; a “data sources & coverage” table; and a “responsible betting safeguards” checklist aligned to NCAA-style guardrails (limiting risky bet types, compliance expectations). citeturn32view1turn6news50

**Query fan-out set**
Primary: “What integrity services does Genius Sports provide?”  
Secondary buyer questions: “What is bet monitoring?”; “How do you detect suspicious activity?”; “What leagues do you monitor?”; “Do you cover offshore markets?”; “What is integrity education?”; “How do audits work?”; “How do you protect athletes?”; “How do you share intelligence with sportsbooks?”; “What is your approach to responsible betting?”; “How do you avoid conflicts of interest?” citeturn35view6turn32view1turn6news50  
Implementation: “How is monitoring configured for a league?”; “What reporting cadence do you provide?”; “How do you integrate with a league integrity unit?”; “What’s the escalation path?”; “How do you train participants?”  
Risk/limitations: “What can monitoring miss?”; “How do you handle limited market visibility?”; “What legal constraints apply?”; “What happens if suspicious activity is detected?”; “How do you handle data privacy?” citeturn11search7turn6news50  
Comparisons: “Genius vs Sportradar integrity monitoring”; “IBIA-based monitoring vs proprietary monitoring”; “League-run integrity vs outsourced”; “Education-only vs monitoring + education”; “Reactive vs proactive integrity programs”

#### League/Federation solutions blueprint (Data Capture + league admin)

**Canonical “What is it?” block to publish (copy-ready)**  
Genius Sports’ **league technology** solutions help leagues and federations **capture official tracking and event data**, connect live scoreboard feeds, and digitize competition administration—turning each game into a reliable data ecosystem that supports performance, fan engagement, officiating, and commercial growth. citeturn33view3turn34view0turn26view1  

**Ideal page structure**
1) Definition + audience (league ops, IT/data, competition admins)  
2) Data Capture modules (computer vision system, auto event data/video, capture software, scoreboard data) citeturn33view3turn14view5turn33view7  
3) League software/admin modules (competition management, member management) citeturn34view0  
4) Implementation timeline by venue/competition tier  
5) Proof: adoption numbers + case studies with metrics (currently weak) citeturn24view0turn25view0  
6) FAQ architecture

**Required extractable units to add**
A “Venue deployment requirements” checklist; a “data types” table (tracking vs event vs video); and a “league maturity model” decision framework.

**Query fan-out set**
Primary: “What league technology does Genius Sports provide?”  
Secondary buyer questions: “What is mesh tracking?”; “What tracking data do you capture?”; “How do you capture play-by-play?”; “What is a digital twin of gameplay?”; “How does scoreboard link-up work?”; “What tools digitize competition admin?”; “How do leagues monetize data?”; “How do you support officials?”; “What sports are supported?”; “How do you ensure data accuracy?” citeturn33view3turn14view5turn33view7  
Implementation: “How long to install cameras?”; “What are camera/in-venue requirements?”; “How do we onboard statisticians?”; “How do we integrate feeds externally?”; “How do we train league staff?”  
Risk/limitations: “What if venues differ?”; “What if connectivity is poor?”; “What’s the accuracy/latency envelope?”; “What’s proprietary vs portable?”; “What rights constraints apply?” citeturn14view5turn35view3  
Comparisons: “Optical tracking vs wearables”; “Automated vs manual eventing”; “ScoreLink+ vs manual scoreboard entry”; “Genius tracking vs competitor tracking”; “League-owned data vs vendor-managed data”

#### Performance blueprint (teams/leagues: Performance Studio, coaching insights)

**Canonical “What is it?” block to publish (copy-ready)**  
Genius Sports’ **performance solutions** combine tracking and event data with AI to deliver **deep video analysis, tactical insights, and decision support** for coaches and analysts—turning millions of in-game data points into actionable performance improvements. citeturn33view4turn14view6  

**Extractable proof already present:** quantified tracking capture scale (“10,000 surface data points… 200 times a second”). citeturn33view4turn16view4  

**Query fan-out set**
Primary: “What performance analysis tools does Genius Sports offer?”  
Secondary buyer questions: “What is Performance Studio?”; “How does AI video filtering work?”; “What sports are supported?”; “What metrics are available?”; “How is tracking paired to video?”; “How do analysts search video?”; “How does it integrate with coaching workflows?”; “What’s the data latency?”; “How does it compare to Hudl?”; “What’s included in league vs team packages?” citeturn34view0turn33view4  
Implementation: “What video sources are required?”; “How do you tag and index plays?”; “What export formats exist?”; “How do you integrate with existing tools?”; “What training is required?”  
Risk/limitations: “What if tracking isn’t available for my venue?”; “What if video rights restrict access?”; “How do you ensure annotation accuracy?”; “What’s the learning curve?”; “What data is proprietary?”  
Comparisons: “Genius Performance Studio vs Hudl”; “Tracking-based analysis vs event-only analysis”; “Team license vs league-wide deployment”; “Automated indexing vs manual tagging”; “Optical tracking vs GPS”

#### Streaming blueprint (BetVision + league streaming)

**Canonical “What is it?” block to publish (copy-ready)**  
Genius Sports enables **official low-latency sports streaming** in two primary contexts: (1) sportsbook experiences like **BetVision**, where streams are merged with betting interactivity; and (2) league/broadcast workflows where official audio-visual content can be produced, distributed, and commercialized. citeturn35view9turn35view4  

**Query fan-out set**
Primary: “Does Genius Sports provide live streaming?”  
Secondary buyer questions: “What is BetVision streaming?”; “How low is the latency?”; “Which sports support streaming?”; “What rights are required?”; “Can streaming be integrated into sportsbook apps?”; “How do you monetize streaming?”; “What ad formats are supported?”; “How do you handle regional restrictions?”; “How do you ensure stream quality?”; “How does streaming connect to data?” citeturn35view9turn32view1turn35view0  
Implementation: “What SDKs exist?”; “How do you authenticate users?”; “What’s the CDN/DRM model?”; “How do you handle concurrency?”; “How do you embed interactive overlays?”  
Risk/limitations: “What if rights restrict distribution?”; “What if streams fail?”; “What jurisdictions ban watch & bet?”; “What data privacy rules affect personalization?”; “What device constraints exist?”  
Comparisons: “BetVision vs standard sportsbook streaming”; “Low-latency vs standard OTT”; “Official league streams vs unofficial streams”; “Interactive overlays vs passive video”; “Sportsbook streaming vs broadcaster streaming”

#### Data rights blueprint (official data rights, licensing, marks)

**Canonical “What is it?” block to publish (copy-ready)**  
Genius Sports is an **official data distribution partner** for major sports organizations, providing licensed access to official league data feeds (and, in some programs, marks/logos) to regulated sportsbooks and media partners—under agreements that define what data can be used, where, and for which products. citeturn32view1turn26view9  

**Required extractable units**
A table of “official partnerships (representative)” with dates/terms where public; a “licensed uses” table (betting, media, coaching); and a plain-English “what official means” glossary.

**Query fan-out set**
Primary: “What does official sports data mean?”  
Secondary buyer questions: “Who distributes official NFL data?”; “Who distributes official NCAA tournament data?”; “What is an Authorized Gaming Licensee program?”; “What are licensed sportsbooks allowed to do?”; “What is the difference between official and unofficial data?”; “Why does official data matter for in-play?”; “How do data rights affect latency?”; “How do marks/logos licensing works?”; “How do leagues monetize data?”; “What is the role of integrity safeguards?” citeturn26view9turn32view1turn36view0  
Implementation: “How does a sportsbook license official data?”; “What compliance requirements apply?”; “How do you provision access?”; “How do you handle renewals?”; “How do you audit usage?”  
Risk/limitations: “What if a sportsbook uses unofficial feeds?”; “What if rights change?”; “What if a jurisdiction restricts data use?”; “What if a league has multiple distributors?”; “What are penalties for misuse?”  
Comparisons: “Official distributor vs data aggregator”; “Exclusive vs non-exclusive data rights”; “League-run data vs partner-run data”; “NCAA vs NFL licensing models”; “Genius vs Sportradar rights positions”

### Narrative control plan (off-site footprint that shapes AI answers)

**Domains currently shaping the narrative**
At minimum: Wikipedia for definitions, NFL.com for official data distribution, SEC/EDGAR for business model and risk framing, and major investor press distributions that get picked up widely. citeturn5search0turn26view9turn21view0turn36view0

**What Genius should do**
Use these levers:

1) **Wikipedia alignment (high priority).**  
Wikipedia currently frames Genius as data management + streaming + integrity. That’s not wrong, but it under-represents the adtech/fan activation platform direction and recent acquisitions that support it (e.g., Sports Innovation Lab). Update Wikipedia carefully with citations from high-quality sources (Business Wire, investor releases). citeturn5search0turn13search0turn36view0  

2) **Earned authority for adtech category claims.**  
If Genius wants FANHub / Moment Engine to show up in AI answers for “sports programmatic” and “fan activation,” it needs independent coverage on credible marketing/adtech outlets—not just company press. Investor results already call out iSpot integration; that is a strong third-party-adjacent credibility hook. citeturn36view0turn5search1  

3) **Proactive integrity transparency content.**  
Given mainstream narratives about integrity providers’ conflicts, publish a governance explainer that is safe to cite and acknowledges constraints (regulated vs offshore visibility). This reduces the probability that AI answers rely on single investigative framings. citeturn6news50turn30search1turn35view6  

## 90-day implementation roadmap and measurement

### Phase 1 structural fixes

**Goal:** make Genius’ most important content reliably extractable and canonical.

* Canonicalize sportsbook hubs (choose `/bet/` or `/sportsbooks/`; implement redirects + canonicals). citeturn14view1turn33view1  
* Rebuild marketing newsroom and customer stories to be fully server-rendered with visible body copy (no “headline-only” pages). Prioritize NFL/NCAA announcements first because they drive the highest authority citations. citeturn32view0turn32view1turn26view9  
* Remove/noindex UAT/dev “Hello world” and other low-quality indexable environments. citeturn9search0turn9search10  

Stakeholders: Web engineering, SEO/AEO lead, Comms/PR, Legal (for compliance copy).

### Phase 2 content rebuilds

**Goal:** publish canonical definitional and “how it works” pages that answer engines can cite.

Deliverables to ship in 30–60 days:
* “What is Genius Sports?” canonical definition page (company entity spine)  
* “Official data rights & distribution” hub (NFL + NCAA anchored) citeturn26view9turn32view1  
* “Integrity Services” hub (methods + governance + constraints) citeturn35view6turn6news50  
* “Genius vs Sportradar: what to compare” buyer guide (neutral, criteria-driven)  
* “Sports Data APIs: enterprise guide” (licensing + integration + sample schemas) citeturn26view0turn4search11  

Stakeholders: Product marketing, SEO/AEO, Product owners (Bet/Engage/Perform), Legal/Compliance.

### Phase 3 authority and earned media

**Goal:** shift third-party citations toward Genius’ preferred framing.

* Update Wikipedia using investor/Business Wire citations (careful, compliant). citeturn5search0turn36view0  
* Drive coverage of FANHub/iSpot and Moment Engine/Magnite-type integrations in credible adtech publications (not only press wires). citeturn36view0turn5search1  
* Place technical explainers/interviews on reputable sports business and sports betting outlets to reinforce “official data + integrity + fan activation” as a coherent story.

Stakeholders: PR, analyst relations, exec spokespeople, product marketing.

### Phase 4 measurement and monitoring

**Goal:** quantify “answer share,” not just traffic.

Minimum viable monitoring set:
* A weekly “sentinel query” list (the clusters you supplied + product queries like “What is BetVision?”) and manual capture of: cited domains, whether Genius is cited, and what claims are repeated.
* Track three metrics: **citation rate** (Genius cited / total), **narrative accuracy score** (does the summary match your canonical definition), and **conversion proxy** (referral traffic + demo/contact starts from AI-referred sessions where measurable).
* Align reporting with investor narrative cycles, because investor releases strongly influence AI summaries about profitability and revenue. citeturn36view0turn35view3  

Dependencies: analytics instrumentation, search console + log-based monitoring, internal prompt tracking workflow.

**Expected lift (directional)**
If you fix the newsroom/case-study extractability and publish canonical rights/integrity hubs, you should see the fastest improvements on “what is,” “official data,” and “integrity” queries (because answer engines will finally have a clean on-domain source to cite instead of Wikipedia/third-party narratives). citeturn5search0turn26view9turn35view6