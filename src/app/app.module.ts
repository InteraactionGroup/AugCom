import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './data/app.component';
import {ButtonsWrapperComponent} from './buttons-wrapper/buttons-wrapper.component';
import {PlayBackClearButtonsComponent} from './play-back-clear-buttons/play-back-clear-buttons.component';
import {TextBarComponent} from './textBar/textBar.component';
import {UserBarComponent} from './userBar/user-bar.component';
import {EditionComponent} from './edition/edition.component';
import {FormsModule} from "@angular/forms";
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
import {ShareComponent} from './share/share.component';
import {Ng2ImgMaxModule} from 'ng2-img-max';
import { HttpClientModule } from '@angular/common/http';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { CdkDragDropSortingExampleComponent } from './cdk-drag-drop-sorting-example/cdk-drag-drop-sorting-example.component';
import { DragulaModule } from 'ng2-dragula';


@NgModule({
  declarations: [
    AppComponent,
    TextBarComponent,
    ButtonsWrapperComponent,
    PlayBackClearButtonsComponent,
    UserBarComponent,
    EditionComponent,
    ShareComponent,
    CdkDragDropSortingExampleComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    Ng2ImgMaxModule,
    HttpClientModule,
    DragulaModule.forRoot(),
    DragDropModule,
    ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production})
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
