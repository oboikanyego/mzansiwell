import {Component} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {RouterLink} from '@angular/router';

@Component({selector:'app-home-page',standalone:true,imports:[RouterLink,MatButtonModule,MatIconModule],template:`
<section class="landing-hero page-pad">
  <div class="hero-copy"><span class="eyebrow">Healthy planning that fits real life</span><h1>Eat familiar.<br><em>Live healthier.</em><br>Spend smarter.</h1><p>Turn the food you already enjoy, your monthly budget and your daily routine into a practical meal schedule with calorie guidance, recipe videos and gentle reminders.</p><div class="actions"><a mat-flat-button routerLink="/register">Create my plan <mat-icon>arrow_forward</mat-icon></a><a mat-stroked-button routerLink="/about">See how it works</a></div><div class="proof"><span><mat-icon>verified</mat-icon>No paid AI required</span><span><mat-icon>savings</mat-icon>Budget-aware</span><span><mat-icon>restaurant</mat-icon>Familiar foods</span></div></div>
  <div class="meal-visual"><div class="meal-overlay"><span>YOUR NEXT MEAL · 12:30</span><h2>Chicken, potato & vegetables</h2><p>520 kcal · 38g protein · about R34</p><a mat-flat-button routerLink="/planner">View today’s plan</a></div></div>
</section>
<section class="feature-strip"><article><mat-icon>tune</mat-icon><h3>Made for you</h3><p>Your goals, foods and routine shape every schedule.</p></article><article><mat-icon>account_balance_wallet</mat-icon><h3>Budget first</h3><p>Reuse pantry items and keep monthly estimates visible.</p></article><article><mat-icon>play_circle</mat-icon><h3>Cook with confidence</h3><p>Open practical recipe videos directly from each meal.</p></article></section>
<section class="story page-pad"><div><span class="eyebrow">A calmer way to eat well</span><h2>Healthy doesn’t have to feel unfamiliar.</h2></div><p>EatHealthy begins with what is already on your plate. It filters allergies and exclusions, balances affordable combinations and turns them into a schedule you can actually follow.</p></section>`})
export class HomePageComponent{}
