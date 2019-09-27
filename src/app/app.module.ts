import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './data/app.component';
import { ButtonsWrapperComponent } from './buttons-wrapper/buttons-wrapper.component';
import { PlayBackClearButtonsComponent } from './play-back-clear-buttons/play-back-clear-buttons.component';
import { TextBarComponent } from './textBar/textBar.component';
import { EditionSliderComponent } from './edition-slider/edition-slider.component';
import { UserBarComponent } from './userBar/user-bar.component';
import { EditionComponent } from './edition/edition.component';
import {FormsModule} from "@angular/forms";
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { ShareComponent } from './share/share.component';

@NgModule({
  declarations: [
    AppComponent,
    TextBarComponent,
    ButtonsWrapperComponent,
    PlayBackClearButtonsComponent,
    EditionSliderComponent,
    UserBarComponent,
    EditionComponent,
    ShareComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
