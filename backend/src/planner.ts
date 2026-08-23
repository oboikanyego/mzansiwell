import crypto from 'node:crypto';
import { meals } from './data/meals.js';
import { Meal, MealType, Plan, PlannerProfile } from './types.js';

const normalize = (v: string) => v.trim().toLowerCase();
const containsAny = (meal: Meal, values: string[]) => values.some(v => meal.ingredients.some(i => normalize(i).includes(normalize(v)) || normalize(v).includes(normalize(i))));
const targetCalories = (p: PlannerProfile) => {
 const sexOffset = p.sex === 'male' ? 5 : p.sex === 'female' ? -161 : -78;
 const bmr = 10*p.weightKg + 6.25*p.heightCm - 5*p.age + sexOffset;
 const activity = {low:1.25,moderate:1.45,high:1.65}[p.activity];
 const goal = p.goal === 'lose' ? -350 : p.goal === 'gain' ? 250 : 0;
 return Math.max(1300, Math.round((bmr*activity+goal)/50)*50);
};
const eligible = (m: Meal, p: PlannerProfile) => {
 if (containsAny(m,[...p.allergies,...p.excludedFoods])) return false;
 if (p.diet==='vegetarian' && !m.tags.includes('vegetarian')) return false;
 if (p.diet==='pescatarian' && m.ingredients.includes('chicken')) return false;
 return true;
};
const score = (m: Meal,p:PlannerProfile) => {
 let s = 100-m.costZar;
 if (containsAny(m,p.familiarFoods)) s+=35;
 if (containsAny(m,p.pantryFoods)) s+=30;
 if (m.tags.includes('budget')) s+=18;
 if (m.tags.includes('high-protein')) s+=p.goal==='lose'?14:8;
 if (m.tags.includes('high-fibre')) s+=12;
 return s;
};
const choose = (type:MealType,index:number,p:PlannerProfile) => {
 const options=meals.filter(m=>m.type===type&&eligible(m,p)).sort((a,b)=>score(b,p)-score(a,p));
 if(!options.length) throw new Error(`No safe ${type} meals remain after exclusions.`);
 return options[index%Math.min(options.length,4)]!;
};
export function generatePlan(profile:PlannerProfile,startDate=new Date()):Plan {
 const times:Record<MealType,string>={breakfast:'06:00',lunch:'12:30',snack:'15:00',dinner:'18:30'};
 const types:MealType[]=profile.mealsPerDay===4?['breakfast','lunch','snack','dinner']:['breakfast','lunch','dinner'];
 const days=Array.from({length:profile.planDays},(_,i)=>{
  const date=new Date(startDate); date.setDate(startDate.getDate()+i);
  const selected=types.map((type,j)=>{const m=choose(type,i+j,profile);return {...m,time:times[type],reason:containsAny(m,profile.pantryFoods)?'Uses food already in your pantry':m.tags.includes('budget')?'Strong budget-friendly match':'Balanced match for your preferences'};});
  const total=selected.reduce((a,m)=>({calories:a.calories+m.calories,proteinG:a.proteinG+m.proteinG,costZar:a.costZar+m.costZar}),{calories:0,proteinG:0,costZar:0});
  const workouts=['25-minute brisk walk','20-minute beginner strength','30-minute brisk walk','Mobility and recovery','25-minute strength circuit'];
  return {date:date.toISOString().slice(0,10),meals:selected,exercise:workouts[i%workouts.length]!,exerciseTime:'05:15',totals:total};
 });
 const cost=days.reduce((n,d)=>n+d.totals.costZar,0); const monthly=Math.round(cost/profile.planDays*30);
 const uses=new Map<string,number>(); days.flatMap(d=>d.meals).flatMap(m=>m.ingredients).forEach(i=>uses.set(i,(uses.get(i)||0)+1));
 const notices=['Estimated food costs and nutrition values are planning guides, not retailer quotes or medical prescriptions.'];
 if(monthly>profile.budgetZar) notices.push(`The first pass is about R${monthly-profile.budgetZar} above budget. Prefer pantry matches, beans, lentils, eggs, seasonal produce and store specials.`);
 if(profile.allergies.length) notices.push('Allergy exclusions were applied by ingredient name. Always check packaging and cross-contamination warnings.');
 return {id:crypto.randomUUID(),createdAt:new Date().toISOString(),profile,dailyTargetCalories:targetCalories(profile),days,estimatedPlanCostZar:Math.round(cost),estimatedMonthlyCostZar:monthly,budgetStatus:monthly<=profile.budgetZar?'within':'over',shoppingList:[...uses].map(([item,uses])=>({item,uses})).sort((a,b)=>b.uses-a.uses),notices};
}
