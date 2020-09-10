import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-account-menu',
  templateUrl: './account-menu.component.html',
  styleUrls: ['./account-menu.component.css']
})
export class AccountMenuComponent implements OnInit {


  newMenu = [
    ['Application',
      ['Apparence générale',
        ['Theme de l\'application',
          // ['Theme général'],
          // ['Style de police'],
          ['Gestion des icones']
        ],
        ['gestion des palettes']
      ],
      ['Interaction'// ,
        // ['délais max pour doubleclick'],
        // ['temps de pression min pour longpress']
      ],
      ['Langues' //,
        // ['langue de l\'appli'],
        // ['langue de la synthèse vocale']
      ],
      ['Partager'// ,
        // ['importer/exporter sauvegarde'],
        // ['importer zip'],
        // ['exporter PDF'],
        // ['importer S4Y, P2G, ...']
      ]
    ],
    ['Barre de phrase',
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
    ['Grilles',
      ['Titre de la page'// ,
        // ['nom/picto ou les deux'],
        // ['chemin absolu ou juste nom de la page']
      ],
      ['Format de la grille',
        ['taille de la grille'],
        ['espace entre les picto'],
        ['thème du fond']
      ]
    ],
    ['Pictogrammes',
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


  selectedNewMenu = 'Application';
  selectedSection = '';

  constructor() { }

  ngOnInit(): void {
  }



  getMovingSelectorIndex(){
    switch (this.selectedNewMenu) {
      case 'Application' : return '0';
      case 'Barre de phrase' : return '25%';
      case 'Grilles' : return '50%';
      case 'Pictogrammes' : return '75%';
    }
  }

  selectNewMenu(menu){
    this.selectedNewMenu = (menu as any[]) [0];
  }

  isSelectedMenu(menu){
    return menu[0] === this.selectedNewMenu;
  }

  isSelectedSection(section){
    return section === this.selectedSection;
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

}
