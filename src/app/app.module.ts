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
import {SnapBarComponent} from './components/snap-bar/snap-bar.component';
import {AccountComponent} from './components/account/account.component';
import {AccountInformationComponent} from './components/account-information/account-information.component';
import {PalettesComponent} from './components/palettes/palettes.component';
import {LanguageComponent} from './components/langue/language.component';
import {SavesComponent} from './components/saves/saves.component';
import {ContactComponent} from './components/contact/contact.component';
import {ActualitesComponent} from './components/actualites/actualites.component';
import {BackHomeBarComponent} from './components/back-home-bar/back-home-bar.component';
import {EventComponent} from './components/event/event.component';
import {AlternativeFormsComponent} from './components/alternative-forms/alternative-forms.component';
import {ImageSelectionPageComponent} from './components/image-selection-page/image-selection-page.component';
import {InformationEditionPageComponent} from './components/information-edition-page/information-edition-page.component';
import {AVenirComponent} from './components/a-venir/a-venir.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ErrorOnEditComponent} from './components/error-on-edit/error-on-edit.component';
import {PrintComponent} from './components/print/print.component';
import {TileComponent} from './components/tile/tile.component';
import {LayoutComponent} from './components/layout/layout.component';
import {GridsterModule} from 'angular-gridster2';
import {AccountMenuComponent} from './components/account-menu/account-menu.component';
import {ApplicationThemeComponent} from './components/application-theme/application-theme.component';
import {IconsManagementComponent} from './components/icons-management/icons-management.component';
import {PageTitleManagementComponent} from './components/page-title-management/page-title-management.component';
import {GridFormatManagementComponent} from './components/grid-format-management/grid-format-management.component';
import {PictogramStyleComponent} from './components/pictogram-style/pictogram-style.component';
import {DwellCursorComponent} from './components/dwell-cursor/dwell-cursor.component';
import { MainComponent } from './components/main/main.component';
import { DeletePageComponent } from './components/delete-page/delete-page.component';
import {MatListModule} from '@angular/material/list';
import { DialogDeletePageComponent } from './components/dialog-delete-page/dialog-delete-page.component';
import {MatButtonModule} from '@angular/material/button';
import {MAT_DIALOG_DEFAULT_OPTIONS, MatDialog, MatDialogModule} from "@angular/material/dialog";
import {MatMenuModule} from "@angular/material/menu";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {MatCheckboxModule} from "@angular/material/checkbox";

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
    LanguageComponent,
    SavesComponent,
    ContactComponent,
    ActualitesComponent,
    BackHomeBarComponent,
    EventComponent,
    AlternativeFormsComponent,
    ImageSelectionPageComponent,
    InformationEditionPageComponent,
    AVenirComponent,
    ErrorOnEditComponent,
    PrintComponent,
    TileComponent,
    LayoutComponent,
    AccountMenuComponent,
    ApplicationThemeComponent,
    IconsManagementComponent,
    PageTitleManagementComponent,
    GridFormatManagementComponent,
    PictogramStyleComponent,
    DwellCursorComponent,
    MainComponent,
    DeletePageComponent,
    DialogDeletePageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    Ng2ImgMaxModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
    AppRoutingModule,
    BrowserAnimationsModule,
    GridsterModule,
    MatListModule,
    MatButtonModule,
    MatDialogModule,
    MatMenuModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule
  ],
  bootstrap: [AppComponent],
  providers: [],
  entryComponents: [
    DialogDeletePageComponent,
  ],
})
export class AppModule {
}
