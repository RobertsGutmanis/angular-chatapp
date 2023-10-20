import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthComponent} from './Components/auth/auth.component';
import {AppComponent} from './app.component';
import {RegisterComponent} from './Components/register/register.component';
import {ChatComponent} from "./Components/chat/chat.component";

const routes: Routes = [
  {path: 'auth', component: AuthComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'chat', component: ChatComponent},
  {path: '', component: AppComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
