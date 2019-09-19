import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './data/app.component';
import { BoxesComponent } from './boxes/boxes.component';
import { ButtonsComponent } from './playBackClear/buttons.component';
import { BarComponent } from './textBar/bar.component';
import { ToolbarComponent } from './slider/toolbar.component';
import { UserBarComponent } from './userBar/user-bar.component';

@NgModule({
  declarations: [
    AppComponent,
    BarComponent,
    BoxesComponent,
    ButtonsComponent,
    ToolbarComponent,
    UserBarComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
