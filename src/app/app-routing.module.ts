import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {KeyboardComponent} from './components/keyboard/keyboard.component';
import {ShareComponent} from './components/share/share.component';
import {EditionComponent} from './components/edition/edition.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SettingsComponent} from './components/settings/settings.component';
import {AccountComponent} from './components/account/account.component';
import {BrowserModule} from '@angular/platform-browser';
import {PrintComponent} from './components/print/print.component';
import {UserPageComponent} from "./components/user-page/user-page.component";
import {AuthGuardService} from "./services/auth-guard.service";


const routes: Routes = [
  {path: 'logging', component: UserPageComponent, data: {animation: 'x'}},
  {path: 'keyboard',canActivate:[AuthGuardService], component: KeyboardComponent, data: {animation: 'HomePage'}},
  {path: 'share',canActivate:[AuthGuardService], component: ShareComponent, data: {animation: 'x'}},
  {path: 'print',canActivate:[AuthGuardService], component: PrintComponent, data: {animation: 'x'}},
  {path: 'edit',canActivate:[AuthGuardService], component: EditionComponent, data: {animation: 'x'}},
  {path: 'settings',canActivate:[AuthGuardService], component: SettingsComponent, data: {animation: 'x'}},
  {path: 'account',canActivate:[AuthGuardService], component: AccountComponent, data: {animation: 'x'}},
  {path: '', redirectTo: '/logging', pathMatch: 'full', data: {animation: 'empty'}}
];

@NgModule({
  imports: [BrowserModule, BrowserAnimationsModule, RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})

/**
 * the class describing the different routes available in the project
 */
export class AppRoutingModule {
}
