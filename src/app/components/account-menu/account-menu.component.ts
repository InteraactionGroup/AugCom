import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-account-menu',
  templateUrl: './account-menu.component.html',
  styleUrls: ['./account-menu.component.css']
})
export class AccountMenuComponent implements OnInit {


  newMenu = [
    ['Application',
      ['Theme de l\'application'],
      // ['Gestion des icones'],
      ['gestion des palettes'],
      ['Interaction'],
      ['Langues'],
      ['Partager']
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
    ['Grilles',
      ['Titre de la page'// ,
        // ['nom/picto ou les deux'],
        // ['chemin absolu ou juste nom de la page']
      ],
      ['Format de la grille' // ,
        // ['taille de la grille'],
        // ['espace entre les picto'],
        // ['thème du fond']
      ]
    ],
    ['Pictogrammes',
      ['Style du pictogramme'// ,
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
    ]
  ];


  selectedNewMenu = 'Application';
  selectedSection = 'Theme de l\'application';

  constructor() { }

  ngOnInit(): void {
  }



  getMovingSelectorIndex(){
    switch (this.selectedNewMenu) {
      case 'Application' : return '0';
      // case 'Barre de phrase' : return '25%';
      // case 'Grilles' : return '50%';
      // case 'Pictogrammes' : return '75%';
       case 'Grilles' : return '33%';
       case 'Pictogrammes' : return '66%';
    }
  }

  selectNewMenu(menu){
    this.selectedNewMenu = (menu as any[]) [0];
    this.selectedSection = (menu as any[]) [1][0];
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
