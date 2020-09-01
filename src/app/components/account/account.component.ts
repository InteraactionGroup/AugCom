import {Component, OnInit} from '@angular/core';
import {GeticonService} from '../../services/geticon.service';
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



  newMenu = [
    ['Généralités sur l\'application',
      ['Apparence générale',
        ['Theme de l\'application',
          ['Theme général'],
          ['Style de police'],
          ['Gestion des icones']
        ],
        ['gestion des palettes']
      ],
      ['Interaction',
        ['délais max pour doubleclick'],
        ['temps de pression min pour longpress']],
      ['Langues',
        ['langue de l\'appli'],
        ['langue de la synthèse vocale']
      ],
      ['Partager',
        ['importer/exporter sauvegarde'],
        ['importer zip'],
        ['exporter PDF'],
        ['importer S4Y, P2G, ...']
      ]
    ],
    ['Généralites sur la barre de phrase',
      ['Paramètres de la phrase',
        ['affichage de la phrase'],
        ['définir click sur la phrase']
      ],
      ['Apparence de la phrase',
        ['visibilité texte et image'],
        ['taille des picto'],
        ['taille de la barre'],
        ['afficher ou cacher la barre']
      ],
      ['Boutons de la phrase',
        ['réordonner les boutons'],
        ['afficher/cacher bouton partager'],
        ['afficher/cacher effacer dernier'],
        ['afficher/cacher effacer tout'],
        ['afficher/cacher prononcer la phrase']
      ]
    ]
    ,
    ['Généralités sur les grilles',
      ['Titre de la page',
        ['nom/picto ou les deux'],
        ['chemin absolu ou juste nom de la page']],
      ['Format de la grille',
        ['taille de la grille'],
        ['espace entre les picto'],
        ['thème du fond']
      ]
    ],
    ['Généralités sur les pictogrammes',
      ['Style du texte'],
      ['Style du pictogramme',
        ['afficher l\'image le texte ou les deux'],
        ['position de l\'image par rapport au texte'],
        ['pictogramme de base',
          ['couleur principale'],
          ['texte',
            ['couleur'],
            ['police'],
            ['taille']
          ],
          ['bordures',
            ['couleur des bords'],
            ['modifier les angles'],
            ['taille des bords']
          ]
        ],
        ['pictogramme répertoire',
          ['style du répertoire'],
          ['couleur principale'],
          ['texte',
            ['couleur'],
            ['police'],
            ['taille']
          ],
          ['bordures',
            ['couleur des bords'],
            ['modifier les angles'],
            ['taille des bords']
          ]
        ]
      ]
    ]
  ];

  selectedMenu = 'complementaryInfo';
  selectedSubMenu = 'contacts';

  constructor(public multilinguism: MultilinguismService,
              public getIconService: GeticonService) {
  }



  containsArray(menu) {
    if(typeof menu === 'string'){
      return false;
    }
    // if((menu as any[]).length > 1){
    //   return !(typeof menu[1] === 'string');
    // }
      return true;
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
