import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './data/app.component';
import { BoxesComponent } from './boxes/boxes.component';
import { ButtonsComponent } from './playBackClear/buttons.component';
import { BarComponent } from './textBar/bar.component';
import { ToolbarComponent } from './slider/toolbar.component';
import { UserBarComponent } from './userBar/user-bar.component';
import { EditionPanelComponent } from './edition-panel/edition-panel.component';
import {FormsModule} from "@angular/forms";
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AddEditOptionPaneComponent } from './add-edit-option-pane/add-edit-option-pane.component';

@NgModule({
  declarations: [
    AppComponent,
    BarComponent,
    BoxesComponent,
    ButtonsComponent,
    ToolbarComponent,
    UserBarComponent,
    EditionPanelComponent
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
