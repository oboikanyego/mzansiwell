# EatHealthy Business Requirements Document

## 1. Purpose

EatHealthy helps adults build affordable, repeatable eating and movement routines from foods they already know. Phase 1 is a responsive web application; Phase 2 targets calorie and gym modules followed by a mobile/PWA experience with reliable push reminders and offline tracking.

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

### FR-11 Registration and wellness onboarding

- After account creation, require a separate onboarding step before plan generation.
- Capture a profile image, age, current weight, target weight, height, activity level and relevant consent.
- Upload profile images through Cloudinary using signed server-side upload configuration; never expose Cloudinary secrets in Angular.
- Let members replace or remove their image and edit measurements later.
- Validate plausible ranges while allowing an administrator to configure limits and help text.

### FR-12 Fortnightly progress check-ins

- Create a weight check-in reminder every 14 days while a member has opted in and an active plan.
- Send a reminder email containing a secure sign-in link; never request health information by email reply.
- Allow the member to record weight in kilograms, view dated history and correct an accidental entry.
- Compare recorded change with a clearly labelled, non-guaranteed plan estimate.
- Weight alone must not be used to declare a plan successful, diagnose a problem or automatically intensify calorie restriction.
- When progress differs materially from the estimate across repeated check-ins, offer a plan review and suggest an optional consultation with a registered dietitian or healthcare professional.
- Support snooze, unsubscribe, quiet periods, timezone-aware delivery, retry and delivery-failure logging.

### FR-13 Communications and real-time events

- Place email behind a provider adapter so the same portfolio communication provider can be reused once its current implementation is confirmed.
- Store versioned templates for registration, verification, fortnightly check-in, reminder failure and subscription events.
- Record message status, provider reference, attempt count and timestamps without storing secrets in logs.
- Use Socket.IO for authenticated in-app events such as plan-ready notices, reminder status and future live support.
- Apply per-user rooms, token validation, rate limits and reconnect handling.

### FR-14 Member assistant

- Display the floating assistant only after authentication.
- Initially provide guided navigation, FAQs and contextual shortcuts without paid AI.
- Clearly identify automated responses and escalate clinical questions to professional-help guidance.
- Future conversational AI must use a replaceable provider, retrieval from approved content and strict safety boundaries.

### FR-15 Subscription test payments

- Support a payment-provider adapter with test-mode checkout, verified server-side callbacks and idempotent subscription activation.
- Do not collect or store raw card details.
- Keep test and live keys separate and expose only the provider's permitted public key to the frontend.
- Confirm whether the selected provider is Paystack or Peach Payments before implementation; the current prototype must not create charges.

### FR-16 Home-page meal media

- Autoplay a short muted, looping food-preparation video on the public home page with a still-image fallback.
- Overlay a sample meal time, meal name, estimated calories and estimated price.
- Honour reduced-motion preferences and provide sufficient text contrast.

### FR-17 Expanded administration

- Administrators have all member capabilities plus access to users and roles, plans, catalogue, subscriptions, reminder delivery, communication templates, media, safety flags and audit history.
- Every privileged action requires API-side role enforcement and an audit record; hiding UI controls is not authorization.
- Health data access must be least-privilege and purpose-limited, including for administrators.

### FR-18 Member profile and appearance

- Provide an authenticated profile page for personal details, wellness measurements, profile image, consent and account controls.
- Provide Light, Dark and System appearance modes; System must follow the device preference.
- Persist appearance preference per device and ensure both themes meet accessible contrast targets.

### FR-19 Meal-window reminders and outcomes

- Each planned meal has a configurable start time and end time, for example breakfast from 06:00 to 06:30.
- Notify at the start of the meal window and every 15 minutes inside that window until the member records an outcome.
- Let the member mark a meal Completed, Completed late, Not completed or Snoozed for 15 minutes.
- Stop reminders immediately when an outcome is recorded and automatically stop at the end of the configured window.
- Never continue indefinite 15-minute reminders outside the meal window.
- Store scheduled time, completion time, outcome, reminder attempts and optional reason for reporting.
- Display meal-type icons and provide access to the meal instructions and curated recipe video from the schedule item.

### FR-20 Weekly and monthly performance reports

- Generate a weekly summary every Monday and a monthly summary on the first day of the following month.
- Report completed on time, completed late, not completed and unrecorded items separately.
- Include adherence trend, estimated grocery budget, weight check-in trend and practical schedule-adjustment suggestions.
- Deliver by email only when opted in and keep the same report available inside the application.
- Avoid shame-based scores or language; use the report to improve plan fit.

### FR-21 Subscription lifecycle

- Send configurable in-app and email notices before payment is due, after payment failure and before access changes.
- Suggested notice cadence: seven days before renewal, two days before renewal, on the due date, and after a failed payment.
- Apply a configurable grace period after failed renewal before premium entitlements are paused.
- Expiry must not delete or hide the member's account, profile, consent history, measurements, tracking history or reports.
- The latest generated plan remains readable after expiry; creating or regenerating premium plans, premium reminders and advanced reports pauses.
- Allow renewal, downgrade to Free, payment-method update, data export and account deletion.
- Restoring payment must restore entitlements idempotently without duplicating subscriptions, reminders or plans.
- Payment webhooks and server-side verification are authoritative; the frontend success screen must not activate access.

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
- WeightCheckIn: member, value, unit, captured date, source and correction history.
- Communication: template version, channel, provider reference, delivery state and attempts.
- Subscription: product, provider customer reference, status, renewal and entitlement dates.
- MediaAsset: Cloudinary public identifier, owner, purpose and deletion state.

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

Authentication, Mongo persistence, onboarding, Cloudinary media, fortnightly weight check-ins, admin catalogue, consent/privacy controls, provider-agnostic email, Socket.IO events, test-mode subscription checkout, robust tests, scheduled jobs and deploy pipelines.

### Phase 2 calorie and gym companion modules

Keep Phase 2 inside the same EatHealthy product, identity and navigation.

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
