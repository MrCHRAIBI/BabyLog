# Feature Research

**Domain:** Mobile baby tracker — newborn care logging (feeding / sleep / diaper), local-first
**Researched:** 2026-09-12
**Confidence:** MEDIUM overall — competitor feature sets verified against live official vendor pages (Huckleberry, Nighp Baby Tracker, Glow Baby, Cubtale); user-complaint patterns are LOW confidence (search provider rate-limited on research day; synthesis from background knowledge, consistent with complaints already cited in docs/01). Re-verify complaint-driven claims at requirements time if load-bearing.

## MVP Coverage Check — Locked 5-Feature Scope vs 2025 Landscape

The locked MVP scope (docs/02 v2, refined docs/06) is: 1-tap tracking + 7-day timeline; OLED night UI + haptics; local pediatrician PDF export; local SweetSpot sleep-window prediction (premium-gated); AES-256 encrypted local backup.

| Locked MVP Feature | Verdict vs Market | Notes |
|---|---|---|
| 1. Tracking 1-Tap + 7-day timeline | COVERS core table stakes | Must also ship: edit/backdate/delete any entry (EditSessionSheet exists in docs/06 — verify time-adjust acceptance criteria), quick-add "started 20 min ago" without timer, breast side switch + bottle ml, 4 diaper types. All specified — keep them in scope. |
| 2. OLED night UI + haptics | SOLID differentiator, no competitor owns 3am ergonomics | Validated. Huckleberry/Nighp/Glow all standard dark modes at best. |
| 3. Local pediatrician PDF | COVERS table stakes (reports) and beats competitors on access | Huckleberry gates enhanced reports behind paid tiers; Nighp offers reports but no per-visit PDF; BabyLog's 1 free PDF / 7 days is competitive and honest. |
| 4. Local SweetSpot (premium) | VALIDATED differentiator with two sharp angles | (a) Price story: Huckleberry Plus is $11.99/mo — Lifetime $29.99 is under 3 months of it. (b) Age story: Huckleberry's SweetSpot starts at 2+ months; BabyLog's local EMA can work from ~3 days of data, i.e. during the newborn phase. Set expectations: 0–6 week schedules are chaotic — prediction is a hint, not a promise. |
| 5. Encrypted local backup (free, never paywalled) | TABLE STAKES DONE BETTER THAN LEADERS | None of the three named competitors offers user-owned encrypted backup; all push cloud. This is the trust wedge. Correctly risk-driven-included at MVP. |

**Gaps — commonly expected features NOT in the locked MVP:**

| Gap | Market Evidence | Recommendation |
|---|---|---|
| **G1. Growth logging (weight / length / head circumference)** | Every major tracker logs measurements (Nighp official page: "growth measurements"; Huckleberry customizable tracking). Onboarding already collects birth weight — an ongoing weight log is the natural continuation. Highest-expectation missing feature. | Cheap version at V1.1: manual weight entry + simple history (LOW). WHO percentile curves are MEDIUM complexity (LMS reference data) — defer to V2. |
| **G2. Pumping sessions** | Pumping is on Glow Baby's and Nighp's official feature lists; Huckleberry tracks it per side. For breastfeeding mothers in 2025, "nursing + pumping + bottle" is one mental model; shipping breast + bottle but not pumping looks incomplete to that segment. | Add as a feed sub-type (timer or quick ml entry). LOW complexity — consider squeezing into MVP; minimum: explicit V1.1 line item. |
| **G3. Partner / multi-caregiver sync** | The single largest table-stakes hole. Huckleberry's FREE tier includes multi-device caregiver sync; Nighp and Glow Baby also sync. Two-parent households are the norm. | Deferral to V1.1 (QR Delta) is the right engineering call for MVP stability — but it must be the FIRST post-launch feature, not "V1.1 someday". Marketing must own the "solo primary caregiver, weeks 0–8" frame until then. Data model already anticipates sync_device/sync_tombstone (m001) — good; keep that commitment. |
| **G4. Multi-child / twins** | Cubtale markets twins support; parents of multiples are the heaviest tracker users and strong word-of-mouth. | Do NOT build UI at MVP. DO keep `baby_id` on every session row and a single-row `baby_profile` that generalizes — makes twins a V1.x add instead of a rewrite. |
| **G5. Rich charts / trends** | Competitors ship sleep-over-time graphs; Thomas persona explicitly wants "stats visuelles claires". | Stats-tab daily aggregates cover MVP. Line charts (sleep duration trend, feed interval trend) are a V1.x polish item (LOW-MEDIUM). |

**Differentiators wisely deferred (validated):** widgets/Apple Watch (V2 — native module cost, Huckleberry hides them behind its top tier anyway), solids/allergen tracking (usage window is newborn-first), nanny/guest mode (V2), AI logging via text/voice/photo (see anti-features — conflicts with zero-cloud), community (rejected). CSV import/export at V1.1 is right (data-nerd goodwill, low reach).

## Feature Landscape

### Table Stakes (Users Expect These)

| Feature | Why Expected | Complexity | Notes / MVP Status |
|---------|--------------|------------|-------|
| 1-tap start/stop timers (feed, sleep) + instant log (diaper) | Core loop of every tracker; any friction at 3am = uninstall | LOW | MVP Feature 1. Timer must survive process death (MMKV active-state) — specified. |
| Breast side (L/R) + side switch mid-feed + bottle volume (ml) | All competitors log feed modality; "which side last?" is a top-of-mind question at every feed | LOW | In MVP Track screen (docs/06). Keep default-side memory for speed. |
| Diaper types (wet / dirty / mixed, + clean) with counts | Pediatrician's first-week questions are exactly this | LOW | In MVP (4 chips, 1-tap). |
| Edit / backdate / delete any entry | The universal failure mode: parent falls asleep, timer runs all night. Reviews punish apps where correction is hard | LOW-MEDIUM | EditSessionSheet + ConfirmDeleteSheet exist. REQUIREMENTS ACTION: acceptance criteria must explicitly include changing start/end time of a past session and deleting a mis-log. |
| Daily history timeline (journal by day) | "What happened today?" is checked 8–12x/day; it is the reward of the core loop | LOW | MVP Feature 1 (7-day free; unlimited history premium). |
| Daily totals dashboard (feed count, ml, sleep hours, diaper counts) | Standard summary in every competitor; feeds the PDF too | LOW-MEDIUM | MVP Stats tab. Reuse the same aggregates for PDF export. |
| Growth logging (weight etc.) | Every major tracker logs measurements; post-visit weight is the metric parents chart | LOW (weight-only) / MED (percentiles) | GAP G1 — add V1.1. |
| Pumping sessions | Listed on Glow Baby + Nighp official pages; standard for breastfeeding mothers | LOW | GAP G2 — feed sub-type; target MVP-stretch or V1.1-first-item. |
| Partner / caregiver sync | Huckleberry includes it in the FREE tier; Nighp: "whole family stays up to date" | HIGH (any architecture) | GAP G3 — deferred by design to V1.1; must be first post-launch ship. |
| Data ownership: full backup + restore, export for the doctor | Parents fear losing the only record of their baby's first year; app-store reviews punish exports that are missing or paywalled | LOW-MEDIUM | MVP Features 3 + 5. Backup free forever is the differentiating flavor. |
| No-account, fast onboarding | 3am-adjacent context; every sign-up wall is churn | LOW | MVP (<45 s, zero permissions, disclaimer checkbox). |
| Non-medical disclaimer (onboarding + report + store listing) | Apple guideline 1.4.1; protects against rejection and liability | LOW | MVP, specified. |
| Gentle optional reminders | Competitors remind (feeds, naps); parents resent nagging | LOW | MVP ships only the J30 backup reminder — acceptable. Do not expand into feed/nap nagging free-tier-wide. |

### Differentiators (Competitive Advantage)

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Zero-cloud / zero-account / zero-network-at-boot | The anti-Huckleberry trust wedge: baby biometric data never leaves the device. Backed by subscription-fatigue and paywall-creep complaints (LOW conf.) and privacy-first-parenting trend (docs/01) | LOW (already the architecture) | MVP, cross-cutting. Must stay verifiable (no network calls pre-onboarding; offline provable in airplane mode). |
| OLED Nocturne Glow night UI + haptics | No competitor owns "3am ergonomics"; protects parent melatonin; eyes-closed operability | MEDIUM (1.5 wk budgeted) | MVP Feature 2. Market as a feature, not a theme. |
| Local SweetSpot prediction (EMA, <1 ms) — premium-gated | Beats Huckleberry on both price (Lifetime $29.99 vs $11.99+/mo) and age coverage (works from ~3 days of data vs their 2+ month floor), with zero data leaving the phone | MEDIUM (2.0 wk budgeted) | MVP Feature 4. Free teaser after 3 days of data is the right conversion mechanic. |
| Free, never-paywalled encrypted backup (AES-256, user PIN) | Inverts the industry dark pattern of hostage-taking on data; strongest possible review-proof trust signal | LOW (0.5 wk budgeted) | MVP Feature 5. Ethical rule is also a moat: competitors can't copy it without breaking their subscription logic. |
| Local pediatrician PDF with disclaimer | Directly monetizes the real JTBD ("prove baby is fine" at the checkup); competitors gate reports or skip PDFs | LOW-MEDIUM (1.5 wk budgeted) | MVP Feature 3. |
| Lifetime pricing as primary offer | Aligns with the 18–24 month natural usage window; anti-subscription positioning converts Huckleberry refugees | LOW | MVP monetization. Copy angle: "$29.99 once ≈ 2.5 months of Huckleberry Plus." |
| Partner QR Delta sync (P2P, no server) | Would be the ONLY serverless two-parent sync on the market — differentiates vs Huckleberry's cloud sync (whose bugs are a documented complaint) | HIGH | V1.1. Correctly deferred; ship it first post-launch. |
| Widgets / lock-screen live activity / Watch | See running timer without opening app; Huckleberry reserves these for top tier | HIGH | V2.0. Defer — native modules, per-platform QA. |

### Anti-Features (Commonly Requested, Often Problematic)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Cloud sync / auto-upload | Ubiquitous convenience expectation | Requires backend, violates zero-knowledge promise, breach liability for children's data, recurring cost against a Lifetime revenue model | Encrypted local .babylog backup (MVP) + optional V1.1 QR P2P partner sync; optional manual Google Drive upload later (user-owned account) |
| AI logging via text / voice / photo (Huckleberry Plus "track by text, voice, or photo") | Wow-factor, hands-free appeal | Needs ASR/cloud or heavy on-device models; contradicts zero-network promise; slower than 1 tap for the 8–12x/day loop | Keep 1-tap buttons faster than speech; revisit only as V2 BYOK |
| Social community / forums (Glow Baby model) | Engagement, retention | Moderation burden, backend, dilutes "private tool" positioning | Curated pediatric-tip content as native ad units (already planned, Stats tab only) |
| Paywalled backup / export | Classic monetization dark pattern (industry norm) | Hostage data = 1-star reviews, trust collapse, store risk; contradicts the entire positioning | Free forever; gate prediction/insights/history-limit instead |
| Interstitial ads | Short-term RPI | 3am rage-churn; permanently banned in project ethics | Day-surface native/banner/rewarded only; never on tracking, timer, journal, backup, paywall, onboarding |
| Streaks / gamified care reminders | Engagement mechanics (Cubtale uses them) | Caregiving guilt + anxiety; brand-toxic for exhausted parents | Gentle, optional, single-purpose reminders |
| Mandatory account / email | CRM, retention marketing | 3am friction; contradicts zero-cloud | No account ever; entitlements live in encrypted MMKV |
| On-device heavy ML for prediction | Accuracy ambitions | Binary size, battery, 2-year usage window doesn't amortize it | EMA moving averages (local, <1 ms) |
| Fully custom activity builder | Flexibility requests from power users | Breaks the 3-button 1-tap simplicity that IS the product | Fixed core 3 + curated additions (pumping, tummy time) in V1.x; "hide what you don't use" à la Huckleberry if ever needed |

## Feature Dependencies

```
[Onboarding + disclaimer]
    └──requires--> [Baby profile (encrypted name, birth date)]
                       └──requires--> [Tracking 1-Tap (sessions in SQLite + MMKV timer)]
                                          └──requires--> [7-day Timeline / Journal]
                                          │                 └──requires--> [Edit / backdate / delete entry]
                                          └──enables--> [Daily totals (Stats)]
                                          │                 ├──requires--> [Charts / trends (V1.x)]
                                          │                 └──requires--> [PDF pediatrician export]
                                          └──enables--> [SweetSpot EMA prediction]
                                          │                 └──requires--> >= 3 days of session data
                                          │                 └──gated-by--> [Premium entitlement (IAP)]
                                          └──enables--> [Encrypted backup export/import]
                                                            └──requires--> [Schema versioning + Zod backup format]
                                                            └──requires--> [Restore transactionality]
[V1.1 Partner QR sync] ──requires--> [Stable schema + sync tombstones (anticipated m001)] + [Backup crypto stack]
[V1.1 Growth log] ──requires--> [Baby profile] ──enhances--> [PDF export]
[V1.1 Pumping] ──requires--> [Feed session model with sub-types]
[V2 Widgets/Watch] ──requires--> [Stable v1 core + MMKV timer contract]
[Twins/multi-child] ──requires--> [baby_id on all rows from day one]
```

### Dependency Notes

- **Timeline requires Tracking:** the journal renders the same SQLite sessions the tracker writes; one schema, two surfaces.
- **PDF and Stats share aggregate queries:** build the daily-aggregation service once; the pediatrician PDF is a rendering of it (plus disclaimer header).
- **SweetSpot requires 3 days of data AND the premium entitlement path:** the teaser (free, after day 3) is the conversion moment — entitlements must be live before teaser ships.
- **Backup requires schema versioning before first release:** a v1.0 backup format without version+Zod validation makes every future migration a data-loss event.
- **Partner sync requires the backup crypto stack AND tombstone tables:** building backup first (MVP) is the correct prerequisite ordering — the QR Delta feature is "backup of deltas, transported by QR."
- **Pumping conflicts with nothing but schema rigidity:** model feed sessions with a modality enum (nurse / bottle / pump) now to avoid a migration later.

## MVP Definition

### Launch With (v1) — validates the locked scope

- [x] 1-tap tracking (feed/sleep timers + diaper instant) with crash-survivable timer — the core loop
- [x] Edit / backdate / delete any session — non-negotiable companion to timers (make acceptance criteria explicit)
- [x] Feed modality details: breast side + switch, bottle ml; diaper 4-type chips
- [x] 7-day timeline (free) + unlimited history (premium)
- [x] OLED Nocturne Glow night UI + haptics
- [x] Daily totals Stats + local SweetSpot (premium-gated, teaser day 3)
- [x] Local pediatrician PDF (1 free / 7 days) with disclaimer
- [x] AES-256 encrypted local backup + transactional import (free forever)
- [x] Onboarding <45 s, no account, disclaimer, zero permissions at boot

Verdict: the locked 5-feature scope covers the core table stakes and every differentiator except the three named gaps. Ship it — with pumping (G2) as the one candidate to stretch into MVP if the feed-modality schema lands early (it is a LOW-complexity sub-type of an already-modeled entity).

### Add After Validation (v1.x)

- [ ] Partner QR Delta sync — FIRST priority; trigger: any cohort signal of two-parent households churning
- [ ] Pumping sub-type (if not in v1) — trigger: breastfeeding-mother segment feedback
- [ ] Growth/weight log with simple history — trigger: first pediatrician-visit cohort; percentile curves stay V2
- [ ] CSV import/export — data-nerd goodwill, store-review fuel
- [ ] Optional manual Google Drive upload of the encrypted .babylog — convenience, never automatic
- [ ] Trend charts (sleep duration, feed intervals) — Thomas persona
- [ ] Multi-child (twins) UI — trigger: schema already prepared

### Future Consideration (v2+)

- [ ] Widgets / lock-screen live activity / Apple Watch — highest ask among "power" features; gated behind top tier by Huckleberry, so parity pressure will grow
- [ ] WHO growth percentile curves
- [ ] Solids / allergen tracking — relevant as cohort ages past 6 months
- [ ] Medication / temperature log — safety-sensitive; needs careful disclaimers
- [ ] Nanny / guest mode; BYOK AI insights — both already backlogged in docs/02

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| 1-tap tracking + timeline + edit/backdate | HIGH | LOW-MED | P1 |
| Night OLED UI + haptics | HIGH | MED | P1 |
| Daily totals + pediatrician PDF | HIGH | LOW-MED | P1 |
| Encrypted local backup (free) | HIGH | LOW | P1 |
| SweetSpot local prediction (premium) | MED-HIGH | MED | P1 |
| Pumping sub-type | MED-HIGH | LOW | P1/P2 (stretch into MVP if schema allows) |
| Partner QR sync | HIGH | HIGH | P2 (first v1.1) |
| Growth/weight log | MED-HIGH | LOW | P2 |
| CSV import/export | MED | LOW | P2 |
| Trend charts | MED | LOW-MED | P2 |
| Multi-child (twins) | MED | MED | P3 |
| Widgets / Watch | MED | HIGH | P3 |
| Percentile curves, solids, medication log | LOW-MED (newborn window) | MED | P3 |

## Competitor Feature Analysis

| Feature | Huckleberry | Baby Tracker (Nighp) | Glow Baby | BabyLog (our approach) |
|---------|-------------|----------------------|-----------|------------------------|
| 1-tap timers | Yes, polished but UI-heavy screens | Yes (dated UI) | Timer-based, click-heavy | MVP — fastest loop, haptic-confirmed |
| True OLED night UI | Standard dark mode | No | No | MVP — core differentiator |
| Pediatrician report | Enhanced reports paid tier | Daily/weekly/monthly reports; share with pediatricians (official page) | Not prominent | MVP — free-tier local PDF, disclaimer included |
| Sleep prediction | SweetSpot, Plus tier ($11.99/mo), age 2+ months | No | No | MVP — local EMA from day ~3, premium one-time |
| User-owned encrypted backup | No (cloud account) | No mention (cloud sync) | No | MVP — free, never paywalled |
| Multi-caregiver sync | FREE tier (cloud) | Yes (cloud) | Cloud, heavy | Deferred V1.1 — serverless QR delta; biggest table-stakes risk |
| Growth measurements | Via customizable tracking | Yes (official page) | Health records | Gap G1 — V1.1 |
| Pumping | Yes | Yes (official page) | Yes (official page) | Gap G2 — cheap feed sub-type |
| AI logging (text/voice/photo) | Plus/Premium | No | Glow Premium AI insights | Anti-feature (zero-network) |
| Widgets / Watch | Premium, iOS | No | No | V2 |
| Community | No (content blog) | No | Yes (Glow ecosystem) | Anti-feature (rejected) |
| Pricing | Free / Plus $11.99-mo / Premium $14.99-mo (verified live) | Free + ads / premium IAP | $59.99-yr (verified live) | Free (day-only ads) + $29.99 Lifetime primary |

## Sources

- https://huckleberrycare.com/ and https://huckleberrycare.com/pricing — fetched live 2026-09-12; tier structure, SweetSpot age floor (2+ months), free-tier contents, AI logging, widgets/Watch placement. Confidence: MEDIUM (official marketing pages — feature claims vendor-authored).
- https://nighp.com/ — fetched live 2026-09-12; Nighp Baby Tracker feature list (pumping, growth, medication, reports, family sync). Confidence: MEDIUM.
- https://glowing.com/baby — fetched live 2026-09-12; Glow Baby categories (breastfeeding + pumping), Glow Premium $59.99/yr, community positioning. Confidence: MEDIUM.
- https://www.cubtale.com/ — fetched live 2026-09-12; positioning incl. twins support. Confidence: MEDIUM (landing page only).
- User-complaint patterns (paywall creep, subscription fatigue, logging friction, export pain, sync bugs): LOW confidence — web search provider hit its rate limit on research date; synthesis from background knowledge, directionally consistent with competitor weaknesses documented in docs/01-market-research.md. Re-verify via app-store review mining before using any single complaint claim in copy.
- Internal: docs/01-market-research.md, docs/02-product-strategy.md (v2), docs/06-ui-ux-design.md, .planning/PROJECT.md.

---
*Feature research for: BabyLog Offline — newborn care tracker (local-first)*
*Researched: 2026-09-12*
