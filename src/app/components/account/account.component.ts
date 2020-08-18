import {Component, OnInit} from '@angular/core';
import {GeticonService} from '../../services/geticon.service';
import {IndexeddbaccessService} from '../../services/indexeddbaccess.service';
import {MultilinguismService} from '../../services/multilinguism.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  /*menu and submenus of the account settings*/
  menu: [string, string[]][] = [
    ['account', ['accountInfo', 'saveManagement']],
    ['appearance', ['globalAppearance', 'paletteManagement']],
    ['settings', []],
    ['language', []],
    ['grammar', []],
    ['share', []],
    ['complementaryInfo', ['actuality', 'contacts']]
  ];

  selectedMenu = 'complementaryInfo';
  selectedSubMenu = 'contacts';

  constructor(public multilinguism: MultilinguismService, public getIconService: GeticonService, public indexeddbaccessService: IndexeddbaccessService) {
  }

  ngOnInit() {
  }

  /*list of menu that are not yet implemented and that are currently displaying the "a venir" page (=soon available)*/
  menuAVenir() {
    return (this.selectedSubMenu === 'actuality') ||
      (this.selectedSubMenu === 'accountInfo') ||
      (this.selectedMenu === 'grammar') ||
      (this.selectedSubMenu === 'globalAppearance') ||
      (this.selectedSubMenu === 'contacts');
  }

  /*get title of the page currently displayed*/
  getMenuPageTitle() {
    if (this.selectedMenu === '') {
      return this.multilinguism.translate('settings')
    } else {
      return '' + this.multilinguism.translate(this.selectedMenu) +
        (this.selectedSubMenu !== '' ?
          (' - ' + this.multilinguism.translate(this.selectedSubMenu)) : '');
    }
  }

  /* select the given menu and open first submenu if it exist*/
  selectMenu(menuSelected: string) {
    if (this.selectedMenu === menuSelected) {
      // this.selectedMenu = '';
    } else {
      this.selectSubMenu(menuSelected, '');
      const menuElement = this.menu.find(elt => {
        return elt[0] === menuSelected;
      });
      if (menuElement !== null && menuElement[1].length > 0) {
        this.selectSubMenu(menuSelected, menuElement[1][0]);
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
