import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AccountMenuComponent} from './account-menu.component';
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {Ng2ImgMaxModule} from "ng2-img-max";

function clickElementOf(compiled: any, fixture: any, selector: any, textIncluded: any) {
  compiled.querySelectorAll(selector).forEach(
    elt => {
      if (elt.textContent.includes(textIncluded)) {
        elt.trigger("click");
      }
    }
  );
  fixture.detectChanges();
}

function expectThisTabToBeTheOnlyOpenTabOfCompiled(compiled: any, openElementName: any) {
  const tabNameList = ['app-page-title-management', 'app-saves', 'app-language', 'app-palettes', 'app-share', 'app-settings', 'app-pictogram-style'];
  tabNameList.forEach(tabName => {
    if (tabName === openElementName) {
      expect(compiled.querySelector(tabName)).not.toBe(null);
    } else {
      expect(compiled.querySelector(tabName)).toBe(null);
    }
  });
}

describe('AccountMenuComponent', () => {
  let component: AccountMenuComponent;
  let fixture: ComponentFixture<AccountMenuComponent>;

  let newMenu: [string, string[]][] = [
    ['Application',
      ['ApplicationTheme',
        'paletteManagement',
        'interactions',
        'language',
        'share']
    ],
    ['Grids',
      ['PageTitle'
        ,
        'GridFormat'
      ]
    ],
    ['Pictograms',
      ['PictogramStyle'
      ]
    ]
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AccountMenuComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [FormsModule, Ng2ImgMaxModule],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain correct titles', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelectorAll('.menuelt')[0].firstChild.textContent).toContain(component.multilinguismService.translate(component.newMenu[0][0]));
    expect(compiled.querySelectorAll('.menuelt')[1].firstChild.textContent).toContain(component.multilinguismService.translate(component.newMenu[1][0]));
    expect(compiled.querySelectorAll('.menuelt')[2].firstChild.textContent).toContain(component.multilinguismService.translate(component.newMenu[2][0]));
  });

  it('should contain correct titles in menu', () => {
    const compiled = fixture.debugElement.nativeElement;
    component.selectedNewMenu = component.newMenu[0][0];
    fixture.detectChanges();
    expect(compiled.querySelectorAll('.title').length).toEqual(5);
    expect(compiled.querySelectorAll('.title')[0].textContent).toContain(component.multilinguismService.translate(component.newMenu[0][1][0]));
    expect(compiled.querySelectorAll('.title')[1].textContent).toContain(component.multilinguismService.translate(component.newMenu[0][1][1]));
    expect(compiled.querySelectorAll('.title')[2].textContent).toContain(component.multilinguismService.translate(component.newMenu[0][1][2]));
    expect(compiled.querySelectorAll('.title')[3].textContent).toContain(component.multilinguismService.translate(component.newMenu[0][1][3]));
    expect(compiled.querySelectorAll('.title')[4].textContent).toContain(component.multilinguismService.translate(component.newMenu[0][1][4]));
  });

  it('should display app-grid-format-management when GridFormat section of Grid is selected', () => {
    const compiled = fixture.debugElement.nativeElement;
    compiled.querySelectorAll('.menuelt')[1].click(); // Pictograms
    fixture.detectChanges();
    compiled.querySelectorAll('.title')[1].click(); // Pictogram-style
    fixture.detectChanges();
    expect(component.selectedNewMenu).toEqual("Grids");
    expect(component.selectedSection).toEqual("DeletePage");
    expectThisTabToBeTheOnlyOpenTabOfCompiled(compiled, 'app-grid-format-management');
  });

  it('should display app-page-title-management when Grids menu is clicked', () => {
    const compiled = fixture.debugElement.nativeElement;
    compiled.querySelectorAll('.menuelt')[1].click(); // Pictograms
    fixture.detectChanges();
    expect(component.selectedNewMenu).toEqual("Grids");
    expect(component.selectedSection).toEqual("PageTitle");
    expectThisTabToBeTheOnlyOpenTabOfCompiled(compiled, 'app-page-title-management');
  });

});
