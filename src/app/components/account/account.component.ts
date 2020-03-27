import {Component, OnInit} from '@angular/core';
import {GeticonService} from "../../services/geticon.service";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  menu = [
    ['Compte', ['Informations du compte', 'Gestion des sauvegardes']],
    ['Apparence', ['Apparence générale', 'Gestion des palettes']],
    ['Paramètres', ['Languee1', 'Languee2', 'Languee3']],
    ['Langue', ['Général', 'Son']],
    ['Grammaire', ['Evenementse1', 'Evenementse2', 'Evenementse3']],
    ['Partager', ['Importer', 'Exporter', 'Réseaux']],
    ['Informations complémentaires', ['Actualités', 'Contacts']]
  ];

  selectedMenu = 'Compte';
  selectedSubMenu = '';

  constructor(public getIconService: GeticonService) {
  }

  ngOnInit() {
  }

  getMenuPageTitle() {
    if (this.selectedMenu === "") {
      return "Paramètres"
    } else {
      return "" + this.selectedMenu + (this.selectedSubMenu !== '' ? (" - " + this.selectedSubMenu) : '');
    }
  }

  selectMenu(menu: string) {
    if (this.selectedMenu === menu) {
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

  /**
   * return the icon url corresponding to the string s
   * @param s, the string identifying the icon
   * @return the icon url
   */
  getIcon(s: string) {
    return this.getIconService.getIconUrl(s);
  }

}
