---
name: Nocturne Glow
colors:
  surface: '#14121e'
  surface-dim: '#14121e'
  surface-bright: '#3b3745'
  surface-container-lowest: '#0f0c18'
  surface-container-low: '#1d1a26'
  surface-container: '#211e2b'
  surface-container-high: '#2b2835'
  surface-container-highest: '#363340'
  on-surface: '#e6e0f2'
  on-surface-variant: '#c8c4d7'
  inverse-surface: '#e6e0f2'
  inverse-on-surface: '#322f3c'
  outline: '#928ea0'
  outline-variant: '#474555'
  surface-tint: '#c6bfff'
  primary: '#c6bfff'
  on-primary: '#2800a0'
  primary-container: '#8c7fff'
  on-primary-container: '#23008d'
  inverse-primary: '#5844da'
  secondary: '#c2c1ff'
  on-secondary: '#29276a'
  secondary-container: '#424184'
  on-secondary-container: '#b2b1fd'
  tertiary: '#dbbce4'
  on-tertiary: '#3e2847'
  tertiary-container: '#a387ac'
  on-tertiary-container: '#372140'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e4dfff'
  primary-fixed-dim: '#c6bfff'
  on-primary-fixed: '#160066'
  on-primary-fixed-variant: '#3f24c2'
  secondary-fixed: '#e2dfff'
  secondary-fixed-dim: '#c2c1ff'
  on-secondary-fixed: '#130f55'
  on-secondary-fixed-variant: '#403f82'
  tertiary-fixed: '#f7d8ff'
  tertiary-fixed-dim: '#dbbce4'
  on-tertiary-fixed: '#281331'
  on-tertiary-fixed-variant: '#563e5f'
  background: '#14121e'
  on-background: '#e6e0f2'
  surface-variant: '#363340'
typography:
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0.03em
  timer-display:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.03em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-tablet: 1.5rem
  gutter-desktop: 2rem
  margin: 1.25rem
  margin-tablet: 2rem
  margin-desktop: 3rem
  space-xs: 0.5rem
  space-sm: 0.75rem
  space-md: 1.25rem
  space-lg: 1.75rem
  space-xl: 2.5rem
---

## Brand & Style

This design system is tailored for parents navigating the vulnerable, sleepless rhythms of early child-rearing. Operating primarily during middle-of-the-night feeds, sleep transitions, and dim nursery sessions, the interface adopts an ultra-low glare, warm-tinted nightscape philosophy. It blends elements of soft minimalism with ambient, tinted glassmorphism to preserve night vision while imparting warmth and emotional reassurance.

The visual tone is deeply empathetic, serene, and restorative. Crucially, the interface rejects high-stress urgency, abrasive alerts, and clinical medical aesthetics in favor of a comforting, luminous nursery environment. Generous negative space, large touch surfaces, and calm visual rhythms prevent cognitive overload for sleep-deprived caregivers managing interactions single-handedly.

## Colors

The palette is engineered specifically for dark, OLED-friendly ambient environments, replacing stark black/white contrasts with deep, warm twilight tones and soothing periwinkle luminescence.

- **Primary (`#7665FA`)**: A soothing periwinkle violet reserved for primary actions, active sleep/wake timers, and milestone progression states.
- **Secondary (`#9C9BE5`)**: A soft lavender periwinkle utilized for sub-headers, interactive toggles, chart curves, and supportive actions.
- **Tertiary (`#C5A7CE`)**: A gentle lilac mauve providing contextual accenting for feedings, soothing routines, and secondary data chips.
- **Neutral / Surface Canvas (`#1B1924` to `#282532`)**: Deep, warm twilight charcoal providing a low-emission, non-dazzling background layer.
- **Typography & Foreground**:
  - `High Contrast Text`: Warm cream white (`#F9ECE5`) delivers optimal legibility without optical glare.
  - `Secondary Text & Metadata`: Soft lavender (`#9C9BE5`) and muted mauve (`#C5A7CE`) handle timestamps, units, and background status.
  - `Subtle Outlines`: Low-opacity violet-white (`rgba(249, 236, 229, 0.08)`) maintains structural definition without visual noise.

## Typography

Typographic choices prioritize immediate readability under fatigue and low-light conditions. Plus Jakarta Sans provides friendly, open counters and distinct letterforms that maintain clarity at micro-sizes and glanceable distances.

Strict anti-crowding rules apply across all breakpoints:
- Generous line heights (minimum 1.5x on body text) preserve spatial breathing room.
- Letter spacing is relaxed on metadata and labels to prevent visual bleeding on illuminated screens.
- Overlapping headers, dense paragraph clumps, and multi-line descriptive text without vertical margins are prohibited.

## Layout & Spacing

Layouts adhere to an airy fluid grid system designed for effortless one-handed thumb interaction on mobile devices, scaling comfortably into fixed multi-column dashboard panes on tablets and desktops.

- **Mobile (up to 640px)**: 4-column layout with `1.25rem` outer margins and minimum `48px` tap target isolation. Component card gaps enforce `space-md` (`1.25rem`) to ensure distinct visual segregation.
- **Tablet (641px - 1024px)**: 8-column layout with `2rem` outer margins. Quick logging controls remain anchored to bottom utility drawers or persistent thumb-accessible panels.
- **Desktop (1025px+)**: 12-column layout maxing out at `1120px` container width, centering the tracking timeline alongside predictive sleep window charts.

Vertical rhythms prioritize airiness: sections must never bunch together, and every data group requires generous structural separation.

## Elevation & Depth

Visual hierarchy uses tonal surface layering and ambient violet backdrops rather than sharp dropped shadows or blinding high-contrast dividers.

- **Canvas Tier (Base)**: `#1B1924` (Deep twilight foundation).
- **Surface Level 1 (Cards, Modules)**: `#282532` combined with a hairline border (`1px solid rgba(249, 236, 229, 0.06)`).
- **Surface Level 2 (Elevated Sheets, Drawers, Modals)**: `#322E3F` overlaid with a diffuse violet ambient glow: `0 12px 32px -8px rgba(118, 101, 250, 0.16)`.
- **Active Ambient State (Ongoing Sleep / Live Timers)**: Pulsing ambient halo using `0 0 24px rgba(118, 101, 250, 0.25)` to signify active background operations without flashing animations.

## Shapes

The design system incorporates soft, cocoon-like geometry to convey comfort and safety. All primary structural surfaces, cards, and modal sheets use `1rem` (16px, `rounded-2xl`).

- **Cards & Data Modules**: Standardized to `1rem` corner rounding.
- **Buttons & Interactive Chips**: Fully pill-shaped (`rounded-full` / `9999px`) to create tactile, soft touch targets that reduce visual friction.
- **Progress Trackers & Metric Bars**: Fully rounded endpoints to reinforce a smooth, fluid progression of time and daily rhythms.

## Components

### Buttons
- **Primary Action**: Pill-shaped container filled with `#7665FA`, foreground text in `#F9ECE5` (weight 600). Minimum height of `52px` with horizontal padding of `space-lg`.
- **Secondary Action**: Pill-shaped container filled with `rgba(156, 155, 229, 0.12)`, border `1px solid rgba(156, 155, 229, 0.3)`, text in `#9C9BE5`.
- **Touch Targets**: Minimum hit area of `48px x 48px` to guarantee accurate interaction when holding a child.

### Input Fields & Selectors
- **Container**: Background `#282532`, corner radius `1rem`, border `1px solid rgba(249, 236, 229, 0.08)`, vertical padding of `space-md`.
- **Focus State**: Border transitions to `#7665FA` with an ambient glow of `0 0 0 3px rgba(118, 101, 250, 0.2)`.
- **Text & Placeholder**: Value text in `#F9ECE5`; placeholder text in muted lavender (`rgba(156, 155, 229, 0.5)`).

### Cards & Event Logs
- **Surface**: Rounded `1rem` containers with background `#282532` and internal padding of `space-lg` (`1.75rem`).
- **Separation**: Never rely on single-pixel solid dividers. Separate information using distinct vertical stacks, generous `space-sm` gaps, and soft secondary labels.

### Chips & Filter Tags
- **Base State**: Pill-shaped (`rounded-full`), background `rgba(40, 37, 50, 0.8)`, border `1px solid rgba(197, 167, 206, 0.2)`, text `#C5A7CE`.
- **Selected State**: Background `#7665FA`, border `transparent`, text `#F9ECE5`.

### Live Sleep Trackers & Prediction Cards
- **Wake Window Banner**: Elevated surface (`#322E3F`) framed with a soft gradient stroke (`#7665FA` to `#C5A7CE`), displaying remaining wakefulness time in large, distinct typography (`timer-display`).
- **Offline Indicator**: A discreet, reassuring badge in soft lavender (`#9C9BE5`) confirming data is securely cached locally, avoiding jarring alert patterns.