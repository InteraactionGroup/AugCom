import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {UsertoolbarComponent} from './components/usertoolbar/usertoolbar.component';
import {EditionComponent} from './components/edition/edition.component';
import {KeyboardComponent} from './components/keyboard/keyboard.component';
import {DialogbarComponent} from './components/dialogbar/dialogbar.component';
import {ShareComponent} from './components/share/share.component';
import {PopupComponent} from './components/popup/popup.component';
import {FormBuilder, FormsModule} from '@angular/forms';
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
import { UserPageComponent } from './components/user-page/user-page.component';
import {MatCardModule} from "@angular/material/card";
import {MatGridListModule} from "@angular/material/grid-list";
import { DialogDeleteUserComponent } from './components/dialog-delete-user/dialog-delete-user.component';
import { DialogChangeUserComponent } from './components/dialog-change-user/dialog-change-user.component';
import { DialogAddUserComponent } from './components/dialog-add-user/dialog-add-user.component';
import { DialogTextComponent } from './components/dialog-text/dialog-text.component';
import {MatInputModule} from "@angular/material/input";
import { MentionComponent } from './components/mention/mention.component';
import { DeletePageComponent } from './components/delete-page/delete-page.component';
import {MatListModule} from '@angular/material/list';
import { DialogDeletePageComponent } from './components/dialog-delete-page/dialog-delete-page.component';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from "@angular/material/dialog";
import {MatMenuModule} from "@angular/material/menu";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {MatCheckboxModule} from "@angular/material/checkbox";
import { Spb2augComponent } from './components/spb2aug/spb2aug.component';
import { DialogHelpComponent } from './components/dialog-help/dialog-help.component';
import {MatIconModule} from "@angular/material/icon";
import { ResetConfigurationComponent } from './components/reset-configuration/reset-configuration.component';


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
    DialogTextComponent,
    MentionComponent,
    DeletePageComponent,
    DialogDeletePageComponent,
    Spb2augComponent,
    DialogHelpComponent,
    UserPageComponent,
    DialogChangeUserComponent,
    DialogAddUserComponent,
    DialogDeleteUserComponent,
    ResetConfigurationComponent
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
    MatInputModule,
    MatListModule,
    MatButtonModule,
    MatDialogModule,
    MatMenuModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    GridsterModule,
    MatIconModule,
    MatCardModule,
    MatGridListModule,
    MatDialogModule,
  ],
  bootstrap: [AppComponent],
  providers: [FormBuilder],
  entryComponents: [
    DialogDeletePageComponent,
    DialogHelpComponent
  ],
})
export class AppModule {
}
