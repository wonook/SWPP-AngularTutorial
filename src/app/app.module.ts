import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms'; // <-- NgModel lives here
import { RouterModule }   from '@angular/router';

import { AppComponent } from './app.component';
import { HeroDetailComponent } from './hero-detail.component';
import { HeroService } from './hero.service';
import { HeroesComponent } from './heroes.component';
import { DashboardComponent } from './dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    HeroDetailComponent,
    HeroesComponent,
    DashboardComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule, // <-- import the FormsModule before binding with [(ngModel)]
    RouterModule.forRoot([
      {
      	path: '',
      	redirectTo: '/dashboard',
      	pathMatch: 'full'
      },
      {
        path: 'heroes',
        component: HeroesComponent
      },
      {
      	path: 'dashboard',
      	component: DashboardComponent
      },
    ]),
  ],
  providers: [
  	HeroService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
