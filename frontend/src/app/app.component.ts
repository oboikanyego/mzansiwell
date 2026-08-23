import {CommonModule} from '@angular/common';
import {Component,effect,inject,signal} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatSidenavModule} from '@angular/material/sidenav';
import {NavigationEnd,Router,RouterLink,RouterLinkActive,RouterOutlet} from '@angular/router';
import {filter} from 'rxjs';
import {AuthService} from './auth.service';

type Theme='system'|'light'|'dark';

@Component({selector:'app-root',standalone:true,imports:[CommonModule,RouterOutlet,RouterLink,RouterLinkActive,MatButtonModule,MatIconModule,MatMenuModule,MatSidenavModule],templateUrl:'./app.component.html',styleUrl:'./app.component.scss'})
export class AppComponent{
  readonly auth=inject(AuthService);private router=inject(Router);readonly menuOpen=signal(false);readonly theme=signal<Theme>((localStorage.getItem('eathealthy-theme') as Theme)||'system');readonly authPage=signal(false);
  constructor(){effect(()=>{const theme=this.theme();localStorage.setItem('eathealthy-theme',theme);const dark=theme==='dark'||(theme==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark-theme',dark)});this.router.events.pipe(filter(event=>event instanceof NavigationEnd)).subscribe((event)=>{this.menuOpen.set(false);this.authPage.set(['/login','/register'].includes((event as NavigationEnd).urlAfterRedirects))});}
  setTheme(theme:Theme){this.theme.set(theme)}
  initials(){return this.auth.user()?.name.split(' ').map(x=>x[0]).join('').slice(0,2).toUpperCase()||'EH'}
}
