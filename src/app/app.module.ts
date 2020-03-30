import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {UsertoolbarComponent} from './components/usertoolbar/usertoolbar.component';
import {EditionComponent} from './components/edition/edition.component';
import {KeyboardComponent} from './components/keyboard/keyboard.component';
import {DialogbarComponent} from './components/dialogbar/dialogbar.component';
import {ShareComponent} from './components/share/share.component';
import {PopupComponent} from './components/popup/popup.component';
import {FormsModule} from '@angular/forms';
import {Ng2ImgMaxModule} from 'ng2-img-max';
import {HttpClientModule} from '@angular/common/http';
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
import {AppRoutingModule} from './app-routing.module';
import {SettingsComponent} from './components/settings/settings.component';
import {DragulaModule} from 'ng2-dragula';
import {SnapBarComponent} from './components/snap-bar/snap-bar.component';
import { AccountComponent } from './components/account/account.component';
import { AccountInformationComponent } from './components/account-information/account-information.component';
import { PalettesComponent } from './components/palettes/palettes.component';
import { LanguageSoundComponent } from './components/language-sound/language-sound.component';
import { SavesComponent } from './components/saves/saves.component';
import { ContactComponent } from './components/contact/contact.component';
import { ActualitesComponent } from './components/actualites/actualites.component';

@NgModule({
  declarations: [
    AppComponent,
    UsertoolbarComponent,
    EditionComponent,
    KeyboardComponent,
    DialogbarComponent,
    ShareComponent,
    PopupComponent,
    SettingsComponent,
    SnapBarComponent,
    AccountComponent,
    AccountInformationComponent,
    PalettesComponent,
    LanguageSoundComponent,
    SavesComponent,
    ContactComponent,
    ActualitesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    Ng2ImgMaxModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production}),
    AppRoutingModule,
    DragulaModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule {
}
