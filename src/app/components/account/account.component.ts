import {Component, OnInit} from '@angular/core';
import {GeticonService} from "../../services/geticon.service";
import {Ng2ImgMaxService} from "ng2-img-max";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  /*menu and submenus of the account settings*/
  menu: [string, string[]][] = [
    ['Compte', ['Informations du compte', 'Gestion des sauvegardes']],
    ['Apparence', ['Apparence générale', 'Gestion des palettes']],
    ['Paramètres', []],
    ['Langue', []],
    ['Grammaire', []],
    ['Partager', []],
    ['Informations complémentaires', ['Actualités', 'Contacts']]
  ];

  selectedMenu = 'Informations complémentaires';
  selectedSubMenu = 'Contacts';

  constructor(public getIconService: GeticonService) {
  }

  ngOnInit() {
  }

  /*list of menu that are not yet implemented and that are currently displaying the "a venir" page (=soon available)*/
  menuAVenir() {
    return (this.selectedSubMenu === 'Actualités') ||
      (this.selectedSubMenu === 'Informations du compte') ||
      (this.selectedMenu === 'Grammaire') ||
      (this.selectedSubMenu === 'Apparence générale') ||
      (this.selectedSubMenu === 'Contacts');
  }

  /*get title of the page currently displayed*/
  getMenuPageTitle() {
    if (this.selectedMenu === "") {
      return "Paramètres"
    } else {
      return "" + this.selectedMenu + (this.selectedSubMenu !== '' ? (" - " + this.selectedSubMenu) : '');
    }
  }

  /* select the given menu and open first submenu if it exist*/
  selectMenu(menuSelected: string) {
    if (this.selectedMenu === menuSelected) {
      // this.selectedMenu = '';
    } else {
      this.selectedSubMenu = '';
      this.selectedMenu = menuSelected;
      let menuElement = this.menu.find(elt => {
        return elt[0] === menuSelected;
      });
      if (menuElement !== null && menuElement[1].length > 0) {
        this.selectedSubMenu = menuElement[1][0];
      }
    }
  }

  /*select given submenu of given menu */
  selectSubMenu(menu: string, subMenu: string) {
    this.selectedMenu = menu;
    this.selectedSubMenu = subMenu;
  }

  /**
   * return the icon url corresponding to the string s
   * @param s, the string identifying the icon
   * @return the icon url
   */
  getIcon(s: string) {
    return this.getIconService.getIconUrl(s);
  }

}
