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
| **Config file** | `vitest.config.ts` — créé au plan 01-02 (Wave 0) |
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
| 01-01-T2 | 01 | 1 | OPS-02 | T-01-SC / T-01-01 | zéro dépendance cloud (D-024), paquets SUS approuvés en Task 1 | install check | `npm ls --depth=0` + checks tailwind/eas.json | n/a | ⬜ pending |
| 01-01-T3 | 01 | 1 | OPS-02 | T-01-01 | tokens source unique, scaffold purgé, src/services/.gitkeep (D-008) | tsc + fs | `npx tsc --noEmit` + checks purge + grep @tailwind | n/a | ⬜ pending |
| 01-02-T1 | 02 | 2 | OPS-02 | T-01-02a / T-01-02c | isolation SQL + pagination bannie, zéro SDK cloud | audit (fs scan) | `npx vitest run tests/sql-isolation.test.ts tests/zero-cloud-dependencies.test.ts` | ❌ W0 | ⬜ pending |
| 01-02-T2 | 02 | 2 | OPS-02 | T-01-02b | migrations non destructives, PRAGMAs docs/05 rejoués | audit (fs scan) | `npx vitest run tests/sql-isolation.test.ts tests/migrations-non-destructive.test.ts tests/zero-cloud-dependencies.test.ts` | ❌ W0 | ⬜ pending |
| 01-03-T1 | 03 | 3 | OPS-02 | T-01-03b | m001 idempotente 7/10/6, CHECK addendum | unit (harness) | `npx vitest run tests/migrations/idempotency.test.ts` | ❌ W0 (harness 01-02) | ⬜ pending |
| 01-03-T2 | 03 | 3 | OPS-02 | T-01-03a | caps Zod/CHECK 2000-2001 & 5000-5001, enums, D-042 leaf imports | unit + gate grep | `npx vitest run tests/schemas/boundaries.test.ts` + gate grep D-042 | own task | ⬜ pending |
| 01-04-T1 | 04 | 4 | OPS-02 | T-01-04a/b/c | keyset ties, rollback txn, rejet Zod | unit (harness) | `npx vitest run tests/repositories/babyProfileRepository.test.ts tests/repositories/logEventRepository.test.ts` | own task | ⬜ pending |
| 01-04-T2 | 04 | 4 | OPS-02 | T-01-04a/c | timer atomique, keyset fileExport | unit (harness) | `npx vitest run tests/repositories/timerRepository.test.ts tests/repositories/fileExportRepository.test.ts` | own task | ⬜ pending |
| 01-04-T3 | 04 | 4 | OPS-02 | T-01-04a/b | allowlist analytics, caps errorLog, suite complète verte | unit + full suite | `npx vitest run tests/repositories/eventRepository.test.ts tests/repositories/errorLogRepository.test.ts` puis `npm test` | own task | ⬜ pending |
| 01-05-T1 | 05 | 4 | OPS-02 | T-01-05b/c | clé SecureStore fail-hard, AES-256, path explicite | tsc + grep | `npx tsc --noEmit` + grep AES-256 | n/a | ⬜ pending |
| 01-05-T2 | 05 | 4 | OPS-02 | T-01-05a | entitlements chiffrés uniquement (wiring test + fixture violation), seed D-007 | unit (vi.mock mmkv/secure-store) | `npx vitest run tests/stores/settings-persist.test.ts tests/entitlements-encrypted-instance.test.ts` | own task | ⬜ pending |
| 01-05-T3 | 05 | 4 | OPS-02 | T-01-05e | fallback EN, zéro fetch, round-trip UTF-8 | unit (vi.mock expo-localization) | `npx vitest run tests/i18n/fallback.test.ts` | own task | ⬜ pending |
| 01-06-T1 | 06 | 5 | OPS-02 | T-01-06a / T-01-06e | logger avale ses échecs, sanitation message/code/stack/context | unit (repo factice) | `npx vitest run tests/errors/logger.test.ts` + `npx tsc --noEmit` | own task | ⬜ pending |
| 01-06-T2 | 06 | 5 | OPS-02 | T-01-06b / T-01-06d | allowBackup=false + dataExtractionRules, idempotence plugin | unit plugin + config | `npx vitest run tests/plugins/data-extraction-rules.test.ts` + check app.json | own task | ⬜ pending |
| 01-06-T3 | 06 | 5 | OPS-02 | T-01-06c | isExcludedFromBackup DB+sidecars+MMKV, sweep idempotent | tsc + grep | `npx tsc --noEmit` + greps Swift/defaultDatabaseDirectory | own task | ⬜ pending |
| 01-07-T1 | 07 | 6 | OPS-02 | T-01-07a | boot chain, zéro SQL dans l'écran, zéro réseau | tsc + full suite | `npx tsc --noEmit` + `npm test` + grep repository | own task | ⬜ pending |
| 01-07-T2 | 07 | 6 | OPS-02 | T-01-07a/d/e | AC #1/#5/#7/#9 device Android | manual (device) | checkpoint — voir plan (logcat, aapt2) | n/a | ⬜ pending |
| 01-07-T3 | 07 | 6 | OPS-02 | T-01-07b/e | AC #8 read-back iCloud device iOS | manual (device) | checkpoint — voir plan (EAS + read-back) | n/a | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky — « File Exists » : W0 = créé au plan 01-02 ; own task = créé par le task lui-même.*

---

## Wave 0 Requirements

- [ ] `vitest.config.ts` + vitest install — framework setup (plan 01-02)
- [ ] `tests/harness/sqliteHarness.ts` — better-sqlite3 in-memory harness replayant les PRAGMAs app (WAL inapplicable en :memory:, foreign_keys=ON, busy_timeout, recursive_triggers)
- [ ] `tests/` audits fail-first : isolation SQL, zero-cloud, migrations non destructives (prohibitions SPEC) — créés au plan 01-02 ; audit entitlements chiffrés au plan 01-05

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
