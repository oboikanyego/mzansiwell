# MzansiWell Business Requirements Document

## 1. Purpose

MzansiWell helps adults build affordable, repeatable eating and movement routines from foods they already know. Phase 1 is a responsive web application; Phase 2 targets calorie and gym modules followed by a mobile/PWA experience with reliable push reminders and offline tracking.

## 2. Business goals

- Reduce the effort required to plan daily meals and exercises.
- Prefer affordable, familiar, locally obtainable food combinations.
- Avoid a mandatory paid generative-AI dependency.
- Turn uploaded spreadsheets into an interactive schedule.
- Encourage consistency without shame-based messaging or extreme restriction.

## 3. Personas

- Budget-conscious individual wanting gradual weight change.
- Busy commuter who needs fixed meal/exercise reminders.
- Household planner using pantry foods and a monthly grocery ceiling.
- Wellness professional who may later curate templates (future role).

## 4. Functional requirements

### FR-01 Profile and consent

- Capture name, age, sex used for energy estimation, height, weight, goal, activity, dietary pattern and plan length.
- Capture a monthly grocery budget in ZAR.
- Explain why body measurements are used and obtain explicit consent before persistent storage (production).
- Permit profile export and deletion (production).

### FR-02 Food preferences and safety filters

- Capture familiar foods, pantry foods, disliked/excluded foods and allergies.
- Never knowingly suggest an ingredient matching an exclusion.
- Show an allergy disclaimer because string filtering cannot guarantee cross-contamination safety.
- Support balanced, vegetarian and pescatarian patterns initially.
- Flag clinical scenarios for professional guidance; do not generate therapeutic diets.

### FR-03 Deterministic plan generation

- Generate 7, 10 or 14-day plans with 3 or 4 meals daily.
- Assign configurable times to meals and exercise.
- Score options using familiarity, pantry overlap, estimated cost, variety and nutrition tags.
- Provide a plain-language reason for each selection.
- Estimate daily calories and protein without presenting them as medical measurements.
- Avoid rapid-loss targets and punitive language.

### FR-04 Budget management

- Compare extrapolated monthly plan cost with the user's budget.
- Mark the plan as within budget or needing adjustment.
- Prefer beans, lentils, eggs, seasonal produce, staple grains and pantry reuse when appropriate.
- Produce a consolidated shopping list and allow items to be checked.
- Future: store retailer, region, package size, unit price, effective date and special price.

### FR-05 Spreadsheet import

- Accept `.xlsx` files up to 5 MB.
- Recognise date, meal, focus, prep-note and video columns.
- Preview extracted rows before plan replacement.
- Report missing headers and unsupported/empty files clearly.
- Preserve the original file only with explicit user consent.

### FR-06 Recipe video library

- Attach a curated direct YouTube video or focused YouTube search to meals.
- Embed direct video IDs using privacy-enhanced mode.
- Open searches externally when no exact reviewed video exists.
- Future: use the YouTube Data API for metadata only after quota, copyright and safety review.

### FR-07 Exercise and reminders

- Provide beginner walking, strength, mobility and recovery suggestions.
- Allow preferred days/times and completion tracking.
- Phase 1 demo: browser notification permission and in-app schedule.
- Production: server-backed push/email reminders with timezone, quiet hours, snooze and opt-out.

### FR-08 Daily tracking

- Track completion of meals and movement without requiring calorie logging.
- Track water and sleep in the next increment.
- Show weekly consistency rather than rewarding extreme restriction.
- Store demo tracking locally; persist per authenticated user in production.

### FR-09 Administration (Phase 1.1)

- Curators manage food items, nutrition estimates, dietary tags, prices and recipe links.
- Version all health rules and catalogue changes.
- Audit administrative actions.

### FR-10 Optional AI enhancement (future)

- Core plan generation must work when AI is disabled.
- AI may propose substitutions or rewrite explanations, but must not override allergies, budget ceilings or safety rules.
- Display AI-originated content and require deterministic validation before saving.
- Support a local model or pay-as-you-go provider behind a replaceable adapter.

## 5. Non-functional requirements

- Responsive WCAG 2.2 AA-oriented interface.
- API validation and consistent error responses.
- No secrets in the frontend or repository.
- Target p95 API response below 800 ms for catalogue-based planning.
- Personal data encrypted in transit and at rest in production.
- South African POPIA-aligned consent, purpose limitation, retention and deletion design.
- Automated planner unit tests, API integration tests and accessibility checks.
- Docker-based local environment and documented deployment configuration.

## 6. Data model

- User: identity, timezone, consent timestamps.
- WellnessProfile: measurements, goal, activity, dietary pattern, budget.
- FoodItem: ingredients, serving, nutrition estimate, dietary/allergen tags.
- MealTemplate: meal type, ingredients, cost, video, tags and version.
- Plan / PlanDay / PlannedMeal: generated schedule and explanation.
- PriceObservation: region, retailer, package, unit cost, effective dates.
- Reminder: event type, local time, recurrence, channel, status.
- TrackingEvent: scheduled item, completion and optional note.

## 7. Out of scope for Phase 1

- Medical diagnosis, treatment, therapeutic diets or medication advice.
- Automated clinical decisions.
- Live grocery checkout or guaranteed retailer prices.
- Wearable integration, social feeds and coach marketplace.
- Fully native mobile apps.

## 8. Release phases

### Phase 1 MVP

Responsive Angular app, deterministic planner, curated sample catalogue, budget estimate, Excel preview, recipe videos, browser reminders, tracking and shopping list.

### Phase 1.1 production foundation

Authentication, Mongo persistence, admin catalogue, consent/privacy controls, robust tests, scheduled push/email jobs and deploy pipelines.

### Phase 2 calorie and gym companion modules

Keep Phase 2 inside the same MzansiWell product, identity and navigation.

- Calorie diary with food search, serving sizes, meal totals and remaining daily estimate.
- Quick-add calories and reusable favourite meals.
- Optional barcode/manual nutrition-label entry after data-source review.
- Dedicated gym page with exercise search by muscle, equipment and difficulty.
- Goal-aware workout plans for beginner, intermediate and advanced users.
- Curated instructional videos, written form cues, common mistakes and safety notes.
- Live workout mode showing the current exercise, video, sets, reps, weight and rest countdown.
- Ability to pause, skip, substitute and complete an exercise.
- Workout history, personal records and progressive-overload suggestions.
- Combined nutrition, calorie, body-measurement and workout dashboard.
- The same goal and profile must drive both meal and gym recommendations.
- No paid AI dependency; plans use a curated exercise database and deterministic rules.

Camera-based movement analysis is not part of the first Phase 2 release because it requires specialist validation and may provide unsafe feedback if implemented as a simple visual classifier.

### Phase 2.1 mobile delivery

Package the connected meal, calorie and gym experience with Angular/Ionic or Capacitor, an offline-first tracker, native notifications, barcode scanning and wearable integration evaluation.

### Phase 3 intelligence

Region-aware prices, dietitian-reviewed templates, optional local/hosted AI substitutions, household planning and outcome analytics.

## 9. Success measures

- Plan creation completion rate.
- Percentage of plans within stated budget.
- Seven-day meal/movement adherence.
- Repeat plan generation after two weeks.
- Reminder opt-in and snooze rates.
- Safety-filter defects and reported inappropriate suggestions (target zero severe incidents).

## 10. Acceptance criteria for this prototype

- A valid profile produces the requested number of days.
- Each day contains scheduled meals and an exercise.
- Allergy/excluded ingredient matches are filtered.
- Monthly estimated cost and budget status are visible.
- Shopping items are consolidated.
- Uploaded reference-shaped `.xlsx` schedules return a usable preview.
- Direct YouTube watch URLs embed; search links open safely.
- The application starts using the documented frontend/backend commands.
