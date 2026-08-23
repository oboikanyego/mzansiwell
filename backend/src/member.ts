import { randomUUID } from 'node:crypto';

export type ScheduleOutcome = 'completed' | 'completed_late' | 'missed' | 'snoozed';

export const memberStore = {
  profile: {
    id: 'demo-member', name: 'BK Radipabe', email: 'bk@example.com', age: 31,
    currentWeightKg: 85, targetWeightKg: 76, profileImageUrl: null as string | null,
    theme: 'system' as 'system' | 'light' | 'dark'
  },
  subscription: {
    plan: 'plus', status: 'active' as 'active' | 'past_due' | 'grace' | 'expired' | 'free',
    amountZar: 79, renewsAt: '2026-08-31', graceEndsAt: null as string | null,
    entitlements: ['plan_generation', 'premium_reminders', 'advanced_reports']
  },
  preferences: { meals: true, weight: true, billing: true, reports: true },
  scheduleEvents: [] as Array<{id:string; planId:string; mealId:string; scheduledAt:string; windowEndsAt:string; outcome:ScheduleOutcome; recordedAt:string}>
};

export const notifications = [
  {id:'billing-1', type:'billing', title:'Subscription payment due in 8 days', body:'Review your payment method before 31 August.', read:false, createdAt:new Date().toISOString()},
  {id:'meal-1', type:'meal', title:'Breakfast window closes at 06:30', body:'Mark it complete, snooze once, or record it as not completed.', read:false, createdAt:new Date().toISOString()},
  {id:'weight-1', type:'progress', title:'Your fortnightly check-in is approaching', body:'Record your weight when convenient.', read:false, createdAt:new Date().toISOString()}
];

export function recordScheduleEvent(input: Omit<(typeof memberStore.scheduleEvents)[number], 'id'|'recordedAt'>) {
  const event = {...input, id: randomUUID(), recordedAt: new Date().toISOString()};
  memberStore.scheduleEvents.push(event);
  return event;
}

export function buildSummary() {
  const total=memberStore.scheduleEvents.length;
  const completed=memberStore.scheduleEvents.filter(e=>e.outcome==='completed').length;
  const late=memberStore.scheduleEvents.filter(e=>e.outcome==='completed_late').length;
  const missed=memberStore.scheduleEvents.filter(e=>e.outcome==='missed').length;
  return {period:'current',total,completed,completedLate:late,missed,unrecorded:0,completionRate:total?Math.round((completed+late)/total*100):0,generatedAt:new Date().toISOString()};
}
