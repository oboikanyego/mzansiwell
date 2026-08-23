# EatHealthy

EatHealthy is a budget-aware healthy meal planner designed around real South African routines and food choices. It transforms familiar foods, pantry items, dietary preferences, an optional Excel schedule and a monthly grocery budget into a practical daily eating plan—without requiring a paid AI subscription.

> Eat familiar. Live healthier. Spend smarter.

## Why EatHealthy?

Many nutrition applications assume expensive ingredients, unfamiliar recipes or a permanent AI subscription. EatHealthy starts with what a person already eats and can afford. Its explainable planning engine filters unsafe or unwanted ingredients, favours pantry reuse and affordable combinations, estimates plan cost and creates a schedule that can realistically fit around work and commuting.

The long-term product brings healthy meal planning, calorie tracking and guided gym workouts into one connected experience. The current repository intentionally closes Phase 1 around the meal-planning MVP before those connected modules are added.

## Phase 1 features

- Personal wellness profile, goal and activity level
- Familiar-food and pantry capture
- Monthly grocery budget in ZAR
- Deterministic meal planner (no paid AI required)
- Allergy and dietary exclusions
- 7, 10 or 14-day plans with meal times
- Estimated calories, protein and daily cost
- Budget status and consolidated shopping list
- YouTube recipe links and embedded direct videos
- Daily meal, water, movement and sleep tracking
- Import of `.xlsx` schedules shaped like the included reference workbook
- MongoDB plan persistence when configured, with a stateless demo fallback
- Swagger/OpenAPI endpoint documentation
- Member profile and appearance API contracts
- Subscription status and entitlement contracts
- Notification preference and schedule-outcome endpoints
- Weekly/monthly report-summary endpoint

## Stack

- Angular 20 standalone frontend
- Angular Material
- Node.js + Express + TypeScript backend
- MongoDB + Mongoose (optional for local demo)
- SheetJS for `.xlsx` parsing
- Docker Compose

## Quick start

Requirements: Node.js 20+, npm 10+, and optionally Docker Desktop.

### 1. Start the API

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

The API starts at `http://localhost:3000`. Swagger UI is at `http://localhost:3000/api/docs`.

The member-facing UI and API now share contracts for profiles, subscription state,
notification preferences, meal outcomes and performance summaries. These endpoints
use a documented in-memory demo store until authenticated MongoDB persistence and
scheduled communication jobs are implemented.

MongoDB is optional. With no `MONGODB_URI`, the API uses memory storage so you can try it immediately.

### 2. Start the web app

```bash
cd frontend
npm install
npm start
```

Open `http://localhost:4200`. The Angular dev server proxies `/api` to the backend.

### Docker option

```bash
docker compose up --build
```

Then open `http://localhost:4200`.

## How the no-cost planning engine works

The engine filters a curated food catalogue by allergies, excluded foods and dietary pattern. It scores meals using familiarity, pantry overlap, cost, protein, vegetable content and goal suitability. It then rotates high-scoring meals, checks the daily energy band, estimates the plan cost and creates a shopping list. This is explainable and free to run.

Costs are deliberately editable estimates, not live retailer prices. A later phase can add retailer catalogues or manually maintained regional price lists. An optional AI adapter can later rewrite explanations or propose substitutions, but the core planner does not require it.

## Product boundary

Phase 1 is the healthy diet and meal-planning application. Its light movement suggestion is only a small wellness prompt, not a gym programme.

Phase 2 remains part of EatHealthy and will add:

- A calorie diary for meals, portions and daily energy balance
- A searchable exercise library grouped by muscle, equipment and difficulty
- Personal gym programmes aligned with the user's goal and diet plan
- Exercise detail pages with instructional videos, form cues and safety notes
- A live workout mode with sets, reps, weight, rest timer and completion controls
- Workout history, progressive-overload tracking and personal records
- Shared dashboard insights across food intake, activity and progress

Keeping these modules in one application means the calorie and gym features can use the same profile, goals, schedule and progress history without duplicating accounts or data.

## Excel import

The importer recognises headers such as `Date`, `Breakfast`, `Lunch`, `Snack`, `Dinner`, `Focus`, video columns and `Prep note`. Your supplied workbook works as a reference shape. Imported schedules are previewed before they replace a generated plan.

## Health note

EatHealthy supports general wellness and habit planning. It is not medical advice and does not diagnose or treat disease. Calorie values and food prices are estimates. Users with allergies, pregnancy, diabetes, kidney/heart disease, eating-disorder history, medication-related dietary needs, or other clinical requirements should consult an appropriate registered professional.

## Documentation

- [Business Requirements Document](docs/BRD.md)
- [Architecture and planning flow](docs/ARCHITECTURE.md)
- [Phase 1 close-out sprint](docs/PHASE1-CLOSEOUT.md)

## Project status

Phase 1 prototype. The deterministic planning engine and application source are available for local evaluation. Authentication, clinical catalogue review, production reminder delivery and live retailer pricing remain explicitly tracked as production-foundation work.

## Contributing

Use short-lived feature branches and open a pull request into `main`. Keep Phase 1 changes focused on the meal-planning experience and record calorie/gym work against the Phase 2 roadmap.

## Licence

MIT—see [LICENSE](LICENSE).

## Repository layout

- `frontend/` Angular web app
- `backend/` Express API and deterministic planner
- `docs/BRD.md` detailed business requirements and roadmap
- `docs/ARCHITECTURE.md` design and data flow
- `sample-data/` sample import CSV and food catalogue notes
