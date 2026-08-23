export type Goal = 'lose' | 'maintain' | 'gain';
export type Diet = 'balanced' | 'vegetarian' | 'pescatarian';
export type MealType = 'breakfast' | 'lunch' | 'snack' | 'dinner';

export interface PlannerProfile {
  name: string; age: number; sex: 'female' | 'male' | 'other'; heightCm: number; weightKg: number;
  goal: Goal; activity: 'low' | 'moderate' | 'high'; diet: Diet; budgetZar: number;
  planDays: 7 | 10 | 14; familiarFoods: string[]; pantryFoods: string[];
  excludedFoods: string[]; allergies: string[]; mealsPerDay: 3 | 4;
}
export interface Meal {
  id: string; name: string; type: MealType; ingredients: string[]; calories: number;
  proteinG: number; costZar: number; tags: string[]; youtubeUrl: string;
}
export interface PlannedMeal extends Meal { time: string; reason: string; }
export interface PlanDay { date: string; meals: PlannedMeal[]; exercise: string; exerciseTime: string; totals: { calories: number; proteinG: number; costZar: number }; }
export interface Plan { id: string; createdAt: string; profile: PlannerProfile; dailyTargetCalories: number; days: PlanDay[]; estimatedPlanCostZar: number; estimatedMonthlyCostZar: number; budgetStatus: 'within' | 'over'; shoppingList: { item: string; uses: number }[]; notices: string[]; }
