import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {KeyboardComponent} from './components/keyboard/keyboard.component';
import {ShareComponent} from './components/share/share.component';
import {EditionComponent} from './components/edition/edition.component';
import {AppComponent} from './app.component';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SettingsComponent} from './components/settings/settings.component';


const routes: Routes = [
  { path: 'keyboard', component: KeyboardComponent, data: {animation: 'HomePage'}},
  { path: 'share', component: ShareComponent, data: {animation: 'x'} },
  { path: 'edit', component: EditionComponent , data: {animation: 'x'} },
  { path: 'settings', component: SettingsComponent , data: {animation: 'x'} },
  { path: '', redirectTo: '/keyboard', pathMatch: 'full', data: {animation: 'empty'}  },
];

@NgModule({
  imports: [BrowserModule,
    BrowserAnimationsModule, RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
