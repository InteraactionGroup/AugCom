import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-test-component',
  templateUrl: './test-component.component.html',
  styleUrls: ['./test-component.component.css']
})
export class TestComponentComponent implements OnInit {

  menu = [
    ['Compte', ['Comptee1', 'Comptee2', 'Comptee3']],
    ['Apparence', ['Apparencee1', 'Apparencee2', 'Apparencee3']],
    ['Langue', ['Languee1', 'Languee2', 'Languee3']],
    ['Partager', ['Partagere1', 'Partagere2', 'Partagere3']],
    ['Evenements', ['Evenementse1', 'Evenementse2', 'Evenementse3']],
    ['Informations', ['Informationse1', 'Informationse2', 'Informationse3']]
  ];

  selectedMenu = 'Compte';
  selectedSubMenu = '';

  constructor() { }

  ngOnInit() {
  }

  getMenuPageTitle() {
    return "" + this.selectedMenu + (this.selectedSubMenu!==''? (" - "+ this.selectedSubMenu):'');
  }

  selectMenu(menu: string) {
    if ( this.selectedMenu === menu ) {
      this.selectedMenu = '';
    } else {
      this.selectedMenu = menu;
    }
    this.selectedSubMenu = '';
  }

  selectSubMenu(menu: string, subMenu: string) {
    this.selectedMenu = menu;
    this.selectedSubMenu = subMenu;
  }

}
