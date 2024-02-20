import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {JwtInterceptor} from "./interceptors/jwt-interceptor";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {AuthService} from "./services/auth.service";

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/ita-challenge/challenges'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }
  ]
})
export class AppRoutingModule { }
