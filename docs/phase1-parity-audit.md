# AIForj Phase 1 Parity Audit

Source of truth: `/Users/kevincooke/Desktop/aiforj-phase1-prompts.pdf`

This file captures the binding Phase 1 requirements extracted from the PDF and the pre-remediation gap report observed in the repo and on the live site before implementation work on 2026-04-10.

## Binding checklist

### Design system and global tokens
- Parchment-based palette
- Fraunces, DM Sans, JetBrains Mono font system
- Spacing scale and radius scale
- Reusable UI primitives
- Subtle parchment / noise feel
- Calm motion system
- Dark mode with system detection and manual toggle

### Typography, spacing, animation, dark mode
- Serifs for emotionally resonant headings
- Sans serif body typography
- Monospace for labels and utility text
- Consistent spacing rhythm across sections and cards
- Gentle transitions and hover states
- Reduced motion support where relevant
- Dark mode that respects system preference

### Reusable UI primitives
- Buttons
- Cards
- Tags / chips
- Inputs / textareas
- Progress indicator
- Modal / interstitial patterns

### Homepage
- Clear emotional positioning and credibility
- Primary CTA to `/start`
- Warm, calm hierarchy aligned to the PDF
- Preserve technique discovery
- Preserve email capture
- Preserve premium and workbook monetization
- Credential wording aligned to AIForj Team and clinician-informed wellness scope

### Navigation
- Sticky nav
- Simplified nav for focused product flows where appropriate
- Mobile-friendly behavior
- Clean internal linking to core product and SEO surfaces

### `/start` multi-step flow
- Single-page multi-step flow
- Step 1: emotion selection
- Step 2: intensity
- Step 3: available time
- Step 4: recommendation results
- Back behavior
- Progress indicators
- Smooth transitions and mobile polish

### Exact emotion list and safety interstitial behavior
- Canonical emotion list:
  - Anxious
  - Sad / Low
  - Angry
  - Overwhelmed
  - Shame / Guilt
  - Grief / Loss
  - Numb / Disconnected
  - Lonely
  - Stressed / Burned Out
  - Scared / Fearful
  - Stuck / Lost
  - Self-Destructive
- Self-Destructive choice triggers a safety interstitial
- Interstitial copy includes:
  - "Before we continue..."
  - 988
  - HOME to 741741
  - Continue to tools
  - Get crisis support

### Recommendation cards
- Show exactly 3 recommendations for the chosen emotion and time bucket
- Include quick metadata such as time and modality
- Preserve free/premium context where relevant
- Route to the correct intervention detail

### Intervention data model
- Central intervention data file
- `emotion -> quick / medium / deep`
- Fields for id, title, description, duration, modality, evidence / notes, premium status
- Allow honest placeholders only where the PDF explicitly allows placeholders
- Exact anxious quick intervention IDs preserved

### Pre/post mood measurement system
- `MoodRating`
- Pre intervention rating
- Post intervention rating
- Delta display
- Session-aware experience

### Mood Shift Receipt
- Polished receipt
- Before / after / delta
- Timestamp and duration
- Copy / share / download affordances
- "Send Calm" where specified

### localStorage/session history utilities
- Local storage key `aiforj_sessions`
- Session object includes:
  - `id`
  - `timestamp`
  - `emotion`
  - `intensity`
  - `interventionId`
  - `interventionTitle`
  - `before`
  - `after`
  - `delta`
  - `duration`
- Session history helpers for saving and reading entries

### Intervention routing
- Recommendation cards route into intervention pages
- Context carried via query parameters
- Architecture can differ internally, but UX must match intended flow

### The 3 real anxious quick interventions
- `grounding-54321` -> 5-4-3-2-1 Sensory Grounding
- `physiological-sigh` -> Physiological Sigh
- `name-the-story` -> Name the Story
- All three are real, interactive, mobile-polished experiences

### Email capture
- Preserve working email capture
- Keep it integrated into high-intent surfaces

### Technique pages
- Preserve existing technique pages
- Improve internal linking and SEO where appropriate
- Keep tone clinically credible

### Metadata / structured data / OpenGraph
- Page-specific titles and descriptions
- Canonicals
- OpenGraph / Twitter metadata
- JSON-LD where truthful and relevant

### Mobile responsiveness
- Strong mobile-first polish on homepage, `/start`, and interventions
- No broken layouts or clipped controls

### Reduced motion handling
- Respect reduced motion for animated surfaces where relevant

### Console/runtime issues
- Fix obvious runtime, console, hydration, and broken-state issues

### Performance
- Avoid obvious regressions
- Keep important pages fast and stable
- Reduce unnecessary client-side work when practical

### Monetization surfaces
- Preserve Stripe premium / Talk to Forj flow
- Preserve Gumroad CBT workbook
- Restore workbook visibility if buried or missing
- Improve monetization placement without harming trust

### SEO surfaces
- Strengthen homepage SEO
- Strengthen technique page SEO
- Preserve and improve crawlable internal linking
- Support sitemap / robots / indexing hygiene

## Pre-remediation gap report

### Design system and global tokens
- Partially implemented / mismatched

### Typography, spacing, animation, dark mode
- Partially implemented / mismatched

### Reusable UI primitives
- Fully implemented

### Homepage
- Partially implemented / mismatched

### Navigation
- Partially implemented / mismatched

### `/start` multi-step flow
- Partially implemented / mismatched

### Exact emotion list and safety interstitial behavior
- Broken / regressed

### Recommendation cards
- Partially implemented / mismatched

### Intervention data model
- Partially implemented / mismatched

### Pre/post mood measurement system
- Partially implemented / mismatched

### Mood Shift Receipt
- Partially implemented / mismatched

### localStorage/session history utilities
- Partially implemented / mismatched

### Intervention routing
- Broken / regressed

### The 3 real anxious quick interventions
- Partially implemented / mismatched

### Email capture
- Fully implemented

### Technique pages
- Fully implemented

### Metadata / structured data / OpenGraph
- Partially implemented / mismatched

### Mobile responsiveness
- Partially implemented / mismatched

### Reduced motion handling
- Partially implemented / mismatched

### Console/runtime issues
- Partially implemented / mismatched

### Performance
- Partially implemented / mismatched

### Monetization surfaces
- Partially implemented / mismatched

### SEO surfaces
- Partially implemented / mismatched
