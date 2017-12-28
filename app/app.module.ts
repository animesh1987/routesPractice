import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes, PreloadingStrategy, Route } from '@angular/router';
import { HttpModule } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { MailModule } from './mail/mail.module';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './auth/auth.guard';

import { AppComponent } from './app.component';

// To have a custom preload for some modules.
// Works as a nice replacement for 'PreloadAllModules' if we want to preload only selective modules.
export class CustomPreload implements PreloadingStrategy {
  preload(route: Route, fn: ()=> Observable<any>): Observable<any> {
    return route.data && route.data.preload ? fn() : Observable.of(null);
  }
}

export const ROUTES: Routes = [
  { path: 'dashboard',
    canLoad: [ AuthGuard ],
    // data: { preload: true }, only used if preloading some modules.
    loadChildren: './dashboard/dashboard.module#DashboardModule'},
  { path: '**', redirectTo: 'mail/folder/inbox' }
];

@NgModule({
  declarations: [
    AppComponent
  ],
  providers: [
    CustomPreload
  ],
  imports: [
    BrowserModule,
    HttpModule,
    MailModule,
    AuthModule,
    RouterModule.forRoot(ROUTES)//, { preloadingStrategy: CustomPreload }) used for preloading modules
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {}
