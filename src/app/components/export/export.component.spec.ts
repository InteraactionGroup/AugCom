import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportComponent } from './export.component';
import { IndexeddbaccessService } from 'src/app/services/indexeddbaccess.service';
import { BoardService } from 'src/app/services/board.service';
import { MatDialogModule } from '@angular/material/dialog';
import { Ng2ImgMaxModule } from 'ng2-img-max';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ExportComponent', () => {
  let component: ExportComponent;
  let fixture: ComponentFixture<ExportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportComponent ],
      imports: [MatDialogModule, IndexeddbaccessService, BoardService, Ng2ImgMaxModule, BrowserAnimationsModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
