---
phase: "1"
slug: "foundation-data-layer"
# status lifecycle: draft (seeded by plan-phase) → validated (set by validate-phase §6)
# audit-milestone §5.5 distinguishes NOT-VALIDATED (draft) from PARTIAL (validated + nyquist_compliant: false) (#2117)
status: draft
nyquist_compliant: false
wave_0_complete: false
created: "2026-09-18"
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest (installed this phase) + better-sqlite3 13.x in-memory harness |
| **Config file** | `vitest.config.ts` — none — Wave 0 installs |
| **Quick run command** | `npx vitest run --reporter=dot` |
| **Full suite command** | `npx vitest run` |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run --reporter=dot`
- **After every plan wave:** Run `npx vitest run`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| (filled by planner per-task) | 01 | 1 | OPS-02 | T-1-* / — | allowBackup=false, exclusions backup OS, isolation SQL | unit + audit | `npx vitest run` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `vitest.config.ts` + vitest install — framework setup
- [ ] `tests/harness/sqlite-memory.ts` — better-sqlite3 in-memory harness replayant les PRAGMAs app (WAL inapplicable en :memory:, foreign_keys=ON, busy_timeout, recursive_triggers)
- [ ] `tests/` stubs pour isolation SQL, zero-cloud, migrations non destructives, entitlements chiffrés (prohibitions SPEC)

*If none: "Existing infrastructure covers all phase requirements."*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Dev build se lance sur device Android 14 physique | OPS-02 / AC-1 | Hardware requis | `expo run:android` sur device branché ; app boot sans erreur, zéro appel réseau (logcat) |
| Dev build iOS se lance sur iPhone 12 (emprunté) | OPS-02 / AC-1 | Hardware + enrollment Apple (D-036) + UDID (D-035) | `eas build --profile development` + install ad-hoc ; boot OK |
| Inspection container iOS : db/-wal/-shm/MMKV absents de l'iCloud backup | OPS-02 / AC-8 | Container device-only | Lecture in-app du flag `isExcludedFromBackup` (read-back) sur chaque fichier cible |
| Kill/relaunch : réglage survit via MMKV | AC-5 | Cycle de vie processus | Modifier un réglage → kill app → relancer → valeur conservée |
| Écran de crash brandé + export rapport | D-005/006-ctx | UX visuelle | Provoquer une erreur de rendu → fallback lavande → boutons fonctionnels |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
