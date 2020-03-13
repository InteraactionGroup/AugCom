import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  constructor() { }

  menu = [
    ['Compte', ['Comptee1', 'Comptee2', 'Comptee3']],
    ['Apparence', ['Apparencee1', 'Apparencee2', 'Apparencee3']],
    ['Langue', ['Languee1', 'Languee2', 'Languee3']],
    ['Partager', ['Partagere1', 'Partagere2', 'Partagere3']],
    ['Evenements', ['Evenementse1', 'Evenementse2', 'Evenementse3']],
    ['Informations', ['Informationse1', 'Informationse2', 'Informationse3']]
  ];

  selectedMenu = '';
  selectedSubMenu = '';

  ngOnInit() {
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
