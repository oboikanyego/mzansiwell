import {bootstrapApplication} from '@angular/platform-browser'; import {provideHttpClient} from '@angular/common/http'; import {provideAnimationsAsync} from '@angular/platform-browser/animations/async'; import {AppComponent} from './app/app.component';
bootstrapApplication(AppComponent,{providers:[provideHttpClient(),provideAnimationsAsync()]}).catch(console.error);
