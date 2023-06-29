import {NgModule} from '@angular/core';
import {RouterModule, RouterPreloader, Routes} from '@angular/router';
import {KeyboardComponent} from './components/keyboard/keyboard.component';
import {ImportComponent} from './components/import/import.component';
import {EditionComponent} from './components/edition/edition.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SettingsComponent} from './components/settings/settings.component';
import {AccountComponent} from './components/account/account.component';
import {BrowserModule} from '@angular/platform-browser';
import {PrintComponent} from './components/print/print.component';
import {UserPageComponent} from "./components/user-page/user-page.component";
import {AuthGuardService} from "./services/auth-guard.service";
import {GeneratorGridComponent} from "./components/generator-grid/generator-grid.component";
import {LoadingUserComponent} from './components/loading-user/loading-user.component';
import {LoadingComponent} from "./components/loading/loading.component";
import { PendingChangesGuard } from './services/pending-changes-guard.service';


const routes: Routes = [
  {path: 'logging', component: UserPageComponent, data: {animation: 'x'}},
  {path: ':lang/keyboard', component: KeyboardComponent, data: {animation: 'HomePage'}},
  {path: ':lang/share', component: ImportComponent, data: {animation: 'x'}},
  {path: ':lang/print', component: PrintComponent, data: {animation: 'x'}},
  {path: ':lang/edit', component: EditionComponent, data: {animation: 'x'}},
  {path: ':lang/settings', component: SettingsComponent, data: {animation: 'x'}},
  {path: ':lang/account', component: AccountComponent, data: {animation: 'x'}},
  {path: ':lang/connect/:id', component: LoadingUserComponent},
  {path: 'loading', component: LoadingComponent, data: {animation: 'x'}},
  {path: 'keyboard',canActivate:[AuthGuardService], component: KeyboardComponent, data: {animation: 'HomePage'}},
  {path: 'share',canActivate:[AuthGuardService], component: ImportComponent, data: {animation: 'x'}},
  {path: 'print',canActivate:[AuthGuardService], component: PrintComponent, data: {animation: 'x'}},
  {path: 'edit',canActivate:[AuthGuardService], component: EditionComponent, data: {animation: 'x'}, canDeactivate:[PendingChangesGuard]},
  {path: 'generatorGrid',canActivate:[AuthGuardService], component: GeneratorGridComponent, data: {animation: 'x'}},
  {path: 'settings',canActivate:[AuthGuardService], component: SettingsComponent, data: {animation: 'x'}},
  {path: 'account',canActivate:[AuthGuardService], component: AccountComponent, data: {animation: 'x'}},
  {path:':lang', redirectTo: ':lang/keyboard' },

  {path: '', redirectTo: 'logging', pathMatch: 'full', data: {animation: 'empty'}}
];

@NgModule({
  imports: [BrowserModule, BrowserAnimationsModule, RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule],
  providers: [RouterPreloader]
})

/**
 * the class describing the different routes available in the project
 */
export class AppRoutingModule {
}
