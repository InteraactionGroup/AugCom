import { Component, OnInit } from '@angular/core';
import { MultilinguismService } from "../../services/multilinguism.service";
import { GeticonService } from "../../services/geticon.service";

@Component({
  selector: 'app-account-menu',
  templateUrl: './account-menu.component.html',
  styleUrls: ['./account-menu.component.css']
})
export class AccountMenuComponent implements OnInit {

  /**Sets up the categories of the account menu */
  newMenu: [string, string[]][] = [
    ['Application',
      ['ApplicationTheme',
        // ['Gestion des icones'],
        'paletteManagement',
        'visualisation',
        'interactions',
        'language',
        'share',
        'resetconfig']
    ],
    // ['Barre de phrase',
    //   ['Paramètres de la phrase',
    //     ['affichage de la phrase'],
    //     ['définir click sur la phrase']
    //   ],
    //   ['Apparence de la phrase',
    //     ['visibilité texte et image'],
    //     ['taille des picto'],
    //     ['taille de la barre'],
    //     ['afficher ou cacher la barre']
    //   ],
    //   ['Boutons de la phrase',
    //     ['réordonner les boutons'],
    //     ['afficher/cacher bouton partager'],
    //     ['afficher/cacher effacer dernier'],
    //     ['afficher/cacher effacer tout'],
    //     ['afficher/cacher prononcer la phrase']
    //   ]
    // ]
    // ,
    ['Grids',
      ['PageTitle'// ,
        // ['nom/picto ou les deux'],
        // ['chemin absolu ou juste nom de la page']
        ,
        'GridManagement',
        'GridFormat'//,
        //'clearGrid' ,
        // ['taille de la grille'],
        // ['espace entre les picto'],
        // ['thème du fond']
      ]
    ],
    ['Pictograms',
      ['PictogramStyle',
        'Mention'// ,
        // ['pictogramme de base',
        //   ['couleur principale'],
        //   ['texte',
        //     ['couleur'],
        //     ['police'],
        //     ['taille']
        //   ],
        //   ['bordures',
        //     ['couleur des bords'],
        //     ['modifier les angles'],
        //     ['taille des bords']
        //   ]
        // ]
      ] // ,
      // ['Style du pictogramme repertoire'// ,
      //   // ['style du répertoire'],
      //   // ['afficher l\'image le texte ou les deux'],
      //   // ['position de l\'image par rapport au texte'],
      //   // ['pictogramme de base',
      //   //   // ['couleur principale'],
      //   //   // ['texte',
      //   //   //   ['couleur'],
      //   //   //   ['police'],
      //   //   //   ['taille']
      //   //   // ],
      //   //   // ['bordures',
      //   //   //   ['couleur des bords'],
      //   //   //   ['modifier les angles'],
      //   //   //   ['taille des bords']
      //   //   // ]
      //   // ]
      // ]
    ],
    ['Print',
      ['export',
        'exportStyle'
      ]
    ]
  ];

  selectedNewMenu = 'Application';
  selectedSection = 'ApplicationTheme';

  constructor(public multilinguismService: MultilinguismService,
    public getIconService: GeticonService) {
  }

  ngOnInit(): void {
  }

  /**
   * Is used to move horizontally the moving selector depending on selected menu
   * @returns A percentage between 0, 25, 50 and 75
   */
  getMovingSelectorIndexHorizontally() {
    switch (this.selectedNewMenu) {
      case 'Application':
        return '0';
      case 'Grids':
        return '25%';
      case 'Pictograms':
        return '50%';
      case 'Print':
        return '75%'
    }
  }

  /**
   * Sets menu in parameter as selected menu
   * @param menu Selected menu
   */
  selectNewMenu(menu) {
    this.selectedNewMenu = (menu as any[])[0];
    this.selectedSection = (menu as any[])[1][0];
  }

  /**
   * Checks if menu in parameter is currently selected
   * @param section checked menu
   * @returns true if checked menu is current menu, false elsewise
   */
  isSelectedMenu(menu) {
    return menu[0] === this.selectedNewMenu;
  }

  /**
   * Checks if section in parameter is currently selected
   * @param section checked section
   * @returns true if checked section is current section, false elsewise
   */
  isSelectedSection(section) {
    return section === this.selectedSection;
  }

}
