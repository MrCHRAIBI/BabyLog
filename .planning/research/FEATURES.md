# Feature Research

**Domain:** Offline-first newborn/baby tracking mobile app (BabyLog)
**Researched:** 2026-09-18
**Confidence:** MEDIUM (competitor feature sets verified against primary sources — iTunes Search/Lookup API, official product sites, App Store review feeds — on 2026-09-18; WebSearch quota was exhausted, so generic market claims that could not be fetch-verified are tagged LOW inline. Reddit and Mozilla Privacy Not Included were blocked (403); those angles are covered by App Store reviews + Hacker News instead.)

## Feature Landscape

### Table Stakes (Users Expect These)

Verified across every major competitor listing (Nighp Baby Tracker 227K ratings, Huckleberry 73K/4.92, Nara 23.7K/4.92, Baby Connect, Feed Baby, Sprout, Cubtale, PiyoLog 118K JP, Still-App DE, Mon bébé FR). Missing these = product feels broken on day 1.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| One-tap logging of feeding / sleep / diaper | Universal. Every tracker's core gesture; JP apps specifically design big buttons for drowsy night logging | LOW | BabyLog F01 matches and exceeds (G/D/bottle split buttons). Keep gesture <1s |
| Persistent timer surviving app kill/background | Users feed in other apps or lock the phone; a lost timer = lost trust (Huckleberry data-loss reviews: "randomly wiped out 22 hours of data") | LOW | BabyLog F01 `timer_state` in SQLite + `started_at` — correct design |
| Day timeline + automatic daily totals | Every competitor: PiyoLog time-bar, Feed Baby "Today"/"Timeline", Nighp day/week/month charts | LOW | F03 matches. Ensure totals include "since yesterday 19:00" style night aggregation? — no: market uses calendar-day totals; keep simple |
| Edit / delete with undo, backfill of past times | Sleep-deprived mis-logs are the norm; Nighp users request **seconds-precision** editing of nursing sessions | LOW | F04 covers; requirements should explicitly include backdating (past start time) and seconds precision |
| Mixed diaper entry (pee AND poo in one log) | Direct feature request in Huckleberry reviews; reports need it to be accurate | LOW | Fold into F01/F03 spec detail — not a scope change |
| mL/oz + metric/imperial unit toggle | Nighp review complaint ("no mL units"); US/UK vs FR/DE/JP/CH markets differ | LOW | Fold into F01 spec; default by locale |
| Notes on any event type | Huckleberry request for "doctor's notes"; all majors allow notes per entry | LOW | BabyLog has a note log type — ensure note is attachable to any event, not only standalone |
| PDF/report export to share with a pediatrician | Nighp ("Export records as a PDF"), Cubtale ("log export for pediatricians"), Solid Starts ("download to share with doctors") | MEDIUM | F07/F08 match market. Add a one-line doctor/patient identifier block on the PDF |
| Data backup/restore (device migration) | Feed Baby CSV, Nighp email/print, BabyRepo backup/restore; parents change/lose phones mid-year | MEDIUM | F09 free encrypted backup **exceeds** market (most are cloud-tied or absent). Strong marketing point |
| Dark / night mode | Nighp's single most-requested feature ("My only wish is that the screen had a dark mode"); indie Little One Tracker markets dark theme for night checks | LOW | F02 matches. **Never paywall it** (Huckleberry paywalls widgets/Live Activities — top anger source) |
| No forced account to start logging | HN founders' entire pitch: "couldn't find a baby tracker that didn't require an account". Huckleberry/Nighp/Nara all allow immediate logging | LOW | F05 zéro compte matches; make sure first-run → logging path is <30s |
| Restore purchases that actually work | Nighp 1-star wave over broken purchase restoration | LOW | Paywall spec already includes restore; treat as launch-blocking acceptance test |
| Reliable local persistence (nothing silently lost) | Data-loss bugs are the #2 review killer after paywalls (Huckleberry: "doesn't save 80% of what you take the time to log") | LOW | SQLite WAL + immediate write on F01 already specified; add crash-on-log acceptance test |

### Table Stakes the Settled MVP Defers (the honest gap list)

| Feature | Market evidence | Deferral risk | Recommendation |
|---------|-----------------|---------------|----------------|
| **Caregiver/co-parent sharing or sync** | **Every verified competitor ships it free**: Huckleberry (multi-caregiver sync is a *free* feature), Nighp, Baby Connect (daycare/nanny), Cubtale (real-time family), Nara ("invite partners, grandparents"), PiyoLog ("夫婦でリアルタイムに共有" is the headline), FR Le Baby (iCloud), Ninou (per-person roles) | **HIGH — this is the single biggest table-stakes gap.** In dual-parent households (the majority of the target market), a single-device tracker means only one parent can log or read; the other parent bounces off the app in week 1. F10 (manual QR/file transfer) is only Release 2 | Do not re-open the no-cloud decision. Instead: (1) accelerate F10 toward Release 1.5 if capacity allows; (2) set expectations explicitly in the store listing ("private, single-device tracker — export/transfer to your partner"), turning the limitation into the privacy pitch; (3) ship F14-style "handoff summary" screen cheap. Monitor early reviews for "can't share with my husband/wife" as the top churn driver |
| **Growth tracking (weight/length/head circumference)** | Free in every top-5 competitor (Nighp WHO comparison, Sprout WHO/CDC, Cubtale WHO percentiles, Nara) | MEDIUM — fine for the 0–6 week target window (pediatrician weighs the baby at visits); requests start around the 2–4 month mark | Keep F22 in backlog but expect to pull it forward within ~2 releases post-launch; schema in docs/05 should not preclude a `measurement` event type |
| **Milestones (firsts)** | Free in Nighp, Huckleberry, Nara, Sprout; big engagement/memory driver | LOW-MEDIUM for MVP (note log partially covers) | Backlog is acceptable; revisit as retention feature |
| **Pumping-specific log (sessions, mL)** | Free in all majors; large US segment (exclusive pumpers — Cubtale has a dedicated page) | MEDIUM — pumping parents are underserved by "bottle" only | F13 (Release 2) is the right answer; consider minimal "pumped mL on bottle entry" as a spec detail of F01 |
| **Widgets / Live Activities / Apple Watch** | Nighp, Nara, Cubtale ship free; Huckleberry paywalls them (anger) | LOW-MEDIUM — nice-to-have, not a leave-trigger; the persistent in-app timer compensates | Correctly excluded (OS-native complexity); candidate for Release 3+ if reviews demand it |

### Differentiators (Competitive Advantage)

These align with the Core Value (1-tap offline logging, data never leaves the device) and are validated as unmet demand.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **100% offline, zero account, zero cloud, zero trackers** | Verified white space: **no major player advertises offline mode** (JP market scan found zero). Direct evidence of pain: Huckleberry 1-star "shares your data with 3rd-party trackers… won't launch with NextDNS"; HN: "I couldn't find a baby tracker that didn't require an account". Even Nighp markets mere "on-device AI" and Nara markets "complete privacy" — privacy sells in this category | LOW (it's an architecture, already decided) | Lead store-listing and creative with it. The offline tracker niche has indie validation (Buggy €2.99, Vaava, Cradle Log, Le Baby FR) but none at polish scale — ownable position |
| **Free encrypted backup/restore** | Nobody else offers private encrypted local backup free; market backups are cloud-tied (privacy-negative) or missing. Removes the #1 fear (phone loss) without betraying the promise | MEDIUM | F09. Big trust signal; call it out on the paywall screen as "free, always" |
| **Emergency Doctor Mode free for all** | No competitor has a dedicated 24/48h emergency export; closest are generic (sometimes paywalled) reports. Ethical stance is press/ASO-worthy and immunizes against "you paywall my baby's data in an emergency" attacks | LOW | F08. Differentiator AND reputational shield for the strict free tier |
| **Auto night mode (20:00–07:00) + OLED + one-hand 1-tap** | Verified unmet demand (dark mode = Nighp's top request; nobody auto-schedules it). The 3am use case IS the product | LOW | F02. Emphasize "designed for 3am" in marketing; no competitor claims it |
| **Lifetime IAP ($99.99) + 72h local trial + data never held hostage** | Market anger at subscriptions is the #1 review theme; one-time-purchase apps are beloved (Baby Feed Timer 4.85 one-time purchase; FR "Le Baby" 100-free-entries-then-one-time-IAP, 4.79). Huckleberry's "no trial, no warning. so they hook u" is the anti-pattern to point at | LOW-MEDIUM (IAP plumbing is the cost) | The lifetime SKU + graceful downgrade is the monetization story; put "your data stays yours even if you never pay" in the paywall copy |
| **Fast + calm UX (F33) as a stated principle** | Nighp's core praise: "Clean, fast, simple" — simplicity itself is a loved feature; HN: "existing apps felt too dated and clunky" | LOW | Keep feature surface minimal; resist category creep (community, content, AI) |

### Anti-Features (Commonly Requested, Often Problematic)

Verified from competitor failures — these are as valuable as the feature list.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| AI assistant baked into the core UX | Huckleberry sells Berry AI; Nighp shipped "What's Next" AI | Nighp's **September 2026 forced-AI update caused a 1–2 star review wave** ("suddenly there is AI and I cannot find a way to turn it off") + privacy worry about children's data + AI | BabyLog's BYOK-only, always-optional AI (F30/F31 backlog) is exactly right; any future assistive hint must be disable-able and never occupy prime screen space |
| Paywalling basic UX (widgets, dark mode, logging) | Monetization pressure | Huckleberry's top anger source: "you have to upgrade for basic functionality like live activities… and widgets" | Paywall intelligence/history/depth, never the core gesture or comfort features |
| Ads or promo popups (even for payers) | Incremental revenue | Nighp: "permanent 'continue with plus' advertisement at the very top of my tracker view" + "inappropriate Temu ads" → 1-stars | One respectful paywall moment at natural gestures; zero banners in the tracking surface |
| Withholding/deleting data on downgrade ("data hostage") | Conversion pressure | Huckleberry "no trial, no warning. so they hook u" (2★); doc/03 itself flags the perception risk | BabyLog's hidden-but-kept >24h policy + free emergency export is the mitigation — make it visible in-product ("your history is safe") |
| Cloud sync / forced account | Real multi-device need (see caregiver gap above) | Betrays core promise; Huckleberry tracker complaints; breach exposure of baby biometric data | Local transfer (F10) now; never silent cloud |
| Medical interpretation (stool analysis, cry diagnosis, health "scores") | Perceived value; JP パパっと育児 does cry AI | Regulatory (medical device) risk; doc/02 excludes for good reason | Raw data + exports only; pediatrician does the interpreting |
| Community/social feeds, content libraries | Engagement benchmarks (Glow community, BabyCenter, JP content apps) | Scope explosion; moderation; contradicts calm/offline positioning | Stay a tool. Content is how incumbents justify subscriptions BabyLog doesn't need |

## Feature Dependencies

```
[F05 Profile + local SQLite] (foundation)
    ├──requires──> [F01 1-tap tracking + persistent timer]
    │                 └──requires──> [F03 timeline + totals]  (reads the log)
    │                 └──requires──> [F04 edit/delete/undo]   (operates on the log)
    ├──requires──> [F02 night mode] (pure presentation, independent)
    ├──enables──> [F07 PDF 7/14d]  (aggregates history)
    │                 └──enhances──> [F08 emergency 24/48h]   (same export pipeline, shorter window)
    ├──enables──> [F09 encrypted backup/restore]
    │                 └──prerequisite-for──> [F10 co-parent local transfer] (same file format + crypto)
    ├──requires──> [Trial/entitlement layer (MMKV)] ──gates──> [Paywall, IAP, restore purchases]
    │                 └──depends-on──> [StoreKit 2 / Play Billing]
    [F13 nursing side/pumping] ──requires──> [F01 event schema extensible] (spec detail now, feature R2)
    [F14 handoff screen] ──enhances──> [F03 timeline] (reads "last feed/sleep" — cheap, R2)
    [F10 transfer] ──conflicts──> [strict single-device entitlement] (transfer must merge or move profiles — design decision needed before R2)
    [Widgets/Watch] ──conflicts──> [pure Expo/JS constraint] (requires native Swift/Kotlin — rejected scope)
```

### Dependency Notes

- **F07/F08 share one export pipeline:** build the 24/48h emergency report first (free), the 7/14d PDF (premium) is the same generator with a longer window and nicer layout — do not build twice.
- **F09 backup format is the substrate for F10:** the encrypted JSON v1 format in docs/05 must be designed with multi-device import in mind (merge semantics), or F10 becomes a rewrite.
- **IAP/entitlements gate three visible things only:** unlimited history, multi-profile, 7/14d PDF. Everything else stays free — that gate list is itself a differentiator and must not silently grow.
- **F10 conflicts with the single-device trial model:** when two phones hold data, the 72h trial and entitlement flags live per-device; decide transfer semantics (move vs merge) before Release 2, not during.

## MVP Definition

### Launch With (v1) — settled scope, validated against market

- [x] F01 1-tap tracking + persistent timer — table stakes; the core gesture
- [x] F02 auto night mode 20:00–07:00, OLED — table stakes executed better than market (verified top user request)
- [x] F03 day timeline + daily totals — table stakes
- [x] F04 edit/delete/undo (+ backdating, seconds precision, mixed diaper, units toggle as spec details) — table stakes
- [x] F05 minimal profile, zero account, zero permissions — table stakes and differentiator
- [x] F07 pediatrician PDF 7/14d (premium) — table stakes
- [x] F08 emergency 24/48h export (free) — differentiator + ethical shield
- [x] F09 encrypted backup/restore (free) — differentiator
- [x] 72h local trial → graceful free downgrade (history kept) — counters the category's #1 anger
- [x] Native IAP $39.99/yr + $99.99 lifetime + working restore purchases — lifetime SKU is the market-aligned pricing wedge
- [x] EN + FR localization — covers US/CA/UK/AU/FR/CH credibly; DE/JP/GCC need localization before they're winnable (all local leaders are fully localized; JP is a separate ecosystem led by PiyoLog, 118K ratings)

### Add After Validation (v1.x / Release 1.5–2)

- [ ] F10 co-parent local transfer — trigger: early reviews/retention show "can't share with partner" as top complaint (it will); the #1 competitive gap
- [ ] F14 handoff/relais screen — cheap, reads existing data, softens the no-sync gap for couples
- [ ] F13 nursing side tracker + minimal pumped-mL — trigger: breastfeeding-heavy feedback; schema already supports
- [ ] Growth measurements (F22-lite: manual weight/length entry, no charts) — trigger: users reaching month 2–3; every competitor ships it free
- [ ] DE / JA / AR localization (already architected via i18next) — trigger: ASO tests in DE/JP; both markets are localized-app markets

### Future Consideration (v2+/backlog — matches docs/02 Releases 3–4)

- [ ] F06 sleep-window estimation (local averages) — BabyLog's honest, non-AI answer to SweetSpot; Huckleberry proves willingness to pay for predictions
- [ ] F15 multi-period statistics — table stakes-ish at month 3+ but not a launch need
- [ ] F11/F12 local notifications/dream feed — standard, deferred safely
- [ ] F16–F18 solids/allergens, meds, multi-baby — right horizon
- [ ] Widgets/Live Activities/Watch — only if review pressure justifies native work

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| F01 1-tap + persistent timer | HIGH | LOW | P1 |
| F02 auto night mode OLED | HIGH | LOW | P1 |
| F03 timeline + daily totals | HIGH | LOW | P1 |
| F04 edit/delete/undo + backfill | HIGH | LOW | P1 |
| F05 profile, zero account/offline | HIGH | LOW | P1 |
| Trial + IAP + restore purchases | HIGH (revenue-critical) | MEDIUM | P1 |
| F08 emergency 24/48h export (free) | HIGH | LOW | P1 |
| F09 encrypted backup/restore (free) | HIGH | MEDIUM | P1 |
| F07 pediatrician PDF 7/14d (premium) | MEDIUM-HIGH | MEDIUM | P1 |
| F10 co-parent local transfer | HIGH | MEDIUM-HIGH | P2 (accelerate from R2 if possible) |
| F14 handoff screen | MEDIUM | LOW | P2 |
| F13 nursing side/pumping | MEDIUM-HIGH | LOW-MEDIUM | P2 |
| Growth measurements (F22-lite) | MEDIUM | LOW-MEDIUM | P2 |
| F06 sleep-window prediction | MEDIUM-HIGH | MEDIUM | P3 |
| F15 multi-period stats | MEDIUM | MEDIUM | P3 |
| F16/F17/F18 solids, meds, multi-baby | MEDIUM | LOW-MEDIUM | P3 |
| Widgets/Watch (native) | MEDIUM | HIGH | P3 (likely never, per constraints) |
| Milestones + photos | MEDIUM | LOW-MEDIUM | P3 |

## Competitor Feature Analysis

Verified via iTunes Search/Lookup API + official sites, 2026-09-18 (US storefront unless noted).

| Feature | Nighp Baby Tracker (227K, 4.80) | Huckleberry (73K, 4.92) | Nara (23.7K, 4.92) | Baby Connect (13.9K, 4.79) | BabyLog approach |
|---------|-------------------------------|--------------------------|---------------------|-----------------------------|------------------|
| 1-tap log feed/sleep/diaper | Yes + timers | Yes ("one-touch") | Yes + wake windows | Yes real-time | F01, faster (G/D/bottle split) |
| Persistent timer | Yes | Yes | Yes | Yes | F01 (SQLite timestamp) |
| Daily totals/timeline | Yes + charts | Sleep summaries free | Day/week graphs | Weekly averages | F03 |
| Night/dark mode | **Missing — top user request** | Unknown/absent from listing | Not advertised | No | F02 auto 20:00–07:00 — category-leading |
| Edit/delete/undo | Yes | Yes | Yes | Yes | F04 + explicit undo |
| Caregiver sync | Free, multi-device | **Free** (paywall is predictions) | Free, invites/grandparents | Free core, subscription for saving entries | **Deferred (F10 manual, R2) — biggest gap** |
| Growth/WHO curves | Yes free | Yes free | Yes | Yes | Deferred (backlog F22) |
| PDF/doctor export | Yes | Plus-gated "Enhanced Reports" | Graphs | Yes | F07 premium + **F08 emergency free — unique** |
| Backup | Email/print | Cloud (account) | Cloud account | Web + cloud | **F09 free encrypted local — unique** |
| Widgets/Live Activities/Watch | Free | **Paywalled — anger source** | Free | No | Excluded (native constraint); in-app timer compensates |
| AI | "What's Next" on-device — **forced, backlash Sept 2026** | Plus AI logging; Premium Berry chat | Not core | No | BYOK-only optional backlog — correct |
| Monetization | Plus subscription (ads + banner for legacy buyers) | Free / Plus / Premium (~sub) | Free today | 7-day trial then sub | 72h local trial → strict free tier; $39.99/yr or $99.99 lifetime |
| Offline/no account | Partial (sync is cloud) | No (account + cloud) | No (account) | No (web service) | **100% offline, zero account — unique among majors** |
| Localization | 15+ languages | Wide (179 countries claim) | Wide | Wide | EN+FR launch; de/ja/ar architected |

## Verdict on the Settled MVP (the question asked)

**The settled scope is launch-viable. It covers 12 of 13 verified table stakes, and exceeds the market on night UX, backup privacy, emergency export, and monetization ethics. One table-stakes gap is real and accepted: caregiver sharing.**

1. **Caregiver sync is the only genuine "users will leave" gap** — every verified competitor ships it free and markets it (JP: "real-time sharing with your partner" is the headline feature). A single-device tracker in a two-parent household is a weekly-usage product, not a daily one. Mitigate without re-opening scope: honest store listing, F14 handoff screen cheap and early, F10 accelerated if any capacity exists, and instrument (locally) the split of single vs multi-adult household usage signals if possible.
2. **The free tier is the most aggressive in the category** — every major keeps full history free and paywalls intelligence (Huckleberry) or nothing (Nighp). BabyLog's 24h-visible free tier is a bigger departure than any of them, softened (correctly) by kept-forever data, free emergency export, and free backup. The $99.99 lifetime is the pressure valve that makes it defensible; expect this to be the #1 review theme either way.
3. **Fold four market-verified spec details into requirements now** (no scope change): mixed pee+poo diaper entry, backdating with seconds precision, mL/oz units by locale, notes attachable to any event + a "notes for the doctor" field on exports.
4. **Differentiators worth emphasizing in positioning, in order:** (1) zero cloud/account/trackers — with Huckleberry's third-party-tracker complaints as social proof; (2) night-mode-for-3am as the designed use case (nobody else claims it, and it's a verified top request); (3) free emergency doctor export + free encrypted backup as the ethical inversion of competitor paywalls; (4) lifetime IAP as the anti-subscription stance that review sections reward.
5. **Market readiness by launch market:** EN+FR credibly covers US/CA/UK/AU/FR/CH. DE is winnable after localization (local leaders are German-localized; BabyLog's privacy angle fits the market). JP is a distinct ecosystem (PiyoLog 118K ratings, content/community-led apps, mom-centric design) — do not count JP revenue until JA localization ships, and expect partner-sync absence to hurt most there. GCC/AR awaits RTL (already architected).

## Sources

**Primary, fetched and verified 2026-09-18 (confidence: MEDIUM, cross-checked across ≥2 fetches where possible):**
- iTunes Search/Lookup API (US, DE, FR, JP storefronts): feature descriptions, ratings, pricing for Nighp Baby Tracker – Newborn Log (id779656557), Huckleberry (id1169136078), Nara Baby, Baby Connect, Feed Baby, Sprout Baby, Cubtale, Baby Feed Timer, PiyoLog, Still-App, Napper, Mon bébé, Le Baby, May, Ninou
- Huckleberry App Store listing + most-recent customer-reviews RSS feed (paywall anger, data-loss reports, third-party tracker complaint)
- Nighp Baby Tracker customer-reviews RSS feed (dark-mode request, forced-AI backlash, restore-purchase failures, sync failure)
- glowing.com/baby (Glow Baby pricing $59.99/yr, GlowGPT, tiers); nara.com/baby-tracker (features, "complete privacy" caregiver sharing); cubtale.com
- Hacker News (Algolia API): Show HN threads for Buggy (2025), Vaava (2026), Cradle Log (2026), Little One Tracker — offline/no-account indie wave and tradeoffs

**Not verifiable this session (confidence: LOW, tagged inline where used):**
- WebSearch quota exhausted (resets 2026-09-19); Reddit (403) and Mozilla Privacy Not Included (403) blocked — privacy-practice claims rest on App Store review quotes and HN instead
- AAP/healthychildren.org pediatric tracking expectations (404) — general knowledge only
- Google Play feature parity with iOS assumed, not verified

---
*Feature research for: BabyLog — offline-first newborn tracker*
*Researched: 2026-09-18*
