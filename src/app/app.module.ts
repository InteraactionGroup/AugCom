import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { UsertoolbarComponent } from './components/usertoolbar/usertoolbar.component';
import { EditionComponent } from './components/edition/edition.component';
import { KeyboardComponent } from './components/keyboard/keyboard.component';
import { DialogbarComponent } from './components/dialogbar/dialogbar.component';
import { ShareComponent } from './components/share/share.component';
import { PopupComponent } from './components/popup/popup.component';

@NgModule({
  declarations: [
    AppComponent,
    UsertoolbarComponent,
    EditionComponent,
    KeyboardComponent,
    DialogbarComponent,
    ShareComponent,
    PopupComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
