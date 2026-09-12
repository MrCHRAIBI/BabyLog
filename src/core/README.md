# Core (docs/04)

- `database/` — ouverture SQLite unique (WAL, FK ON), migrations idempotentes `schema_version`, helpers typés `DbAdapter` (prod expo-sqlite / test better-sqlite3)
- `storage/` — MMKV standard + chiffrée (AES-256 explicite, clé dérivée expo-secure-store), adaptateur Zustand persist avec `partialize` obligatoire
- `billing/` — expo-iap wrapper, entitlements 100 % MMKV chiffrée (JAMAIS SQLite), init différée post-onboarding
- `ads/` — AdMob wrapper : init différée, consentement UMP, règles de fréquence codées en dur (zéro interstitial)
- `analytics/` — `track()` local → table `event` SQLite, zéro envoi réseau
- `notifications/` — locales uniquement (rappel backup J30), permission demandée à l'activation
- `ui/` — design system Nocturne Glow (26 composants docs/06, aucun #FFFFFF)
- `utils/` — pdf-assets (Base64 WKWebView), date (dayjs epoch ms), crypto (@noble AEAD 256-bit), error-boundary, useZodForm
- `boot/` — pipeline de démarrage : migrations → MMKV → stores → routes (boot 100 % offline)
