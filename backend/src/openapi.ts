export const openapi={
 openapi:'3.0.3',
 info:{title:'EatHealthy API',version:'0.2.0',description:'Budget-aware meal planning, member schedules, reminders, subscriptions and progress API'},
 servers:[{url:'http://localhost:3000'}],
 paths:{
  '/api/health':{get:{summary:'Health check',responses:{'200':{description:'OK'}}}},
  '/api/catalogue/meals':{get:{summary:'List curated meals',responses:{'200':{description:'Meal catalogue'}}}},
  '/api/plans/generate':{post:{summary:'Generate a deterministic wellness plan',requestBody:{required:true,content:{'application/json':{schema:{$ref:'#/components/schemas/PlannerProfile'}}}},responses:{'201':{description:'Generated plan'},'400':{description:'Invalid profile'}}}},
  '/api/import/excel':{post:{summary:'Preview an Excel meal schedule',requestBody:{content:{'multipart/form-data':{schema:{type:'object',properties:{file:{type:'string',format:'binary'}}}}}},responses:{'200':{description:'Imported schedule preview'}}}},
  '/api/member/profile':{get:{summary:'Get the member profile',responses:{'200':{description:'Member profile'}}},put:{summary:'Update the member profile',responses:{'200':{description:'Updated profile'},'400':{description:'Invalid profile'}}}},
  '/api/member/subscription':{get:{summary:'Get subscription status and entitlements',responses:{'200':{description:'Subscription'}}}},
  '/api/member/notifications':{get:{summary:'Get member notifications and preferences',responses:{'200':{description:'Notifications'}}}},
  '/api/member/notification-preferences':{put:{summary:'Update notification preferences',responses:{'200':{description:'Saved preferences'}}}},
  '/api/member/schedule-events':{post:{summary:'Record completed, late, missed or snoozed schedule outcome',responses:{'201':{description:'Recorded outcome'},'400':{description:'Invalid meal window or outcome'}}}},
  '/api/member/reports/summary':{get:{summary:'Get the current adherence summary',responses:{'200':{description:'Performance summary'}}}}
 },
 components:{schemas:{PlannerProfile:{type:'object',required:['name','age','heightCm','weightKg','goal','budgetZar','planDays'],properties:{name:{type:'string'},age:{type:'integer'},heightCm:{type:'number'},weightKg:{type:'number'},goal:{enum:['lose','maintain','gain']},budgetZar:{type:'number'},planDays:{enum:[7,10,14]}}}}}
};
