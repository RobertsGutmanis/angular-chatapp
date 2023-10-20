import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {AuthComponent} from './Components/auth/auth.component';
import {RegisterComponent} from './Components/register/register.component';
import {HttpClientModule} from '@angular/common/http';
import {ReactiveFormsModule} from '@angular/forms';
import {ChatComponent} from './Components/chat/chat.component';
import {FormatErrorPipe} from './Pipes/format-error.pipe';


@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    RegisterComponent,
    ChatComponent,
    FormatErrorPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
