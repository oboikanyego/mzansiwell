import {Routes} from '@angular/router';
import {adminGuard,authGuard} from './auth.guard';
import {LoginPageComponent,OnboardingPageComponent,RegisterPageComponent} from './auth-pages.component';
import {HomePageComponent} from './home-page.component';
import {AdminPageComponent,NotificationsPageComponent,ProfilePageComponent,ReportsPageComponent,SchedulesPageComponent} from './member-pages.component';
import {PlannerPageComponent} from './planner-page.component';
import {AboutPageComponent,ContactPageComponent,PricingPageComponent} from './public-pages.component';

export const routes:Routes=[
  {path:'',component:HomePageComponent,title:'EatHealthy — Eat familiar. Live healthier.'},
  {path:'home',redirectTo:'',pathMatch:'full'},
  {path:'about',component:AboutPageComponent,title:'About — EatHealthy'},
  {path:'pricing',component:PricingPageComponent,title:'Pricing — EatHealthy'},
  {path:'contact',component:ContactPageComponent,title:'Contact — EatHealthy'},
  {path:'login',component:LoginPageComponent,title:'Sign in — EatHealthy'},
  {path:'register',component:RegisterPageComponent,title:'Register — EatHealthy'},
  {path:'onboarding',component:OnboardingPageComponent,canActivate:[authGuard],title:'Complete your profile — EatHealthy'},
  {path:'planner',component:PlannerPageComponent,canActivate:[authGuard],title:'Meal planner — EatHealthy'},
  {path:'schedules',component:SchedulesPageComponent,canActivate:[authGuard],title:'My schedule — EatHealthy'},
  {path:'profile',component:ProfilePageComponent,canActivate:[authGuard],title:'Profile — EatHealthy'},
  {path:'notifications',component:NotificationsPageComponent,canActivate:[authGuard],title:'Notifications — EatHealthy'},
  {path:'reports',component:ReportsPageComponent,canActivate:[authGuard],title:'Reports — EatHealthy'},
  {path:'admin',component:AdminPageComponent,canActivate:[authGuard,adminGuard],title:'Admin — EatHealthy'},
  {path:'**',redirectTo:''}
];
