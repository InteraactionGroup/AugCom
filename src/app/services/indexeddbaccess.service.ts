import {Injectable} from '@angular/core';
import {BoardService} from './board.service';
import {PaletteService} from './palette.service';
import {JsonValidatorService} from './json-validator.service';
import {ConfigurationService} from "./configuration.service";
import {UserPageService} from "./user-page.service";
import {Grid, User} from '../types';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class IndexeddbaccessService {

  openRequest;

  constructor(public paletteService: PaletteService,
              public boardService: BoardService,
              public jsonValidator: JsonValidatorService,
              public configurationService: ConfigurationService,
              public userPageService: UserPageService,
              public router: Router) {
    this.loadUsersList();
  }

  // UPDATE THE DATABASE
  update() {
    if (this.userPageService.currentUser != null &&
      this.userPageService.currentUser.id != null &&
      this.userPageService.currentUser.id != 1) {

      this.openRequest = indexedDB.open('saveAugcom', 1);

      // ERROR
      this.openRequest.onerror = event => {
        alert('Database error: ' + event.target.errorCode);
      };

      // SUCCESS
      this.openRequest.onsuccess = event => {
        const db = event.target.result;

        // UPDATE THE GRID
        const gridStore = db.transaction(['Grid'], 'readwrite');
        const gridObjectStore = gridStore.objectStore('Grid');
        const storeGridRequest = gridObjectStore.get(this.boardService.gridChosen? this.boardService.gridChosen : this.userPageService.currentUser.gridsID[0]);
        storeGridRequest.onsuccess = () => {
          gridObjectStore.put(this.boardService.board, this.boardService.gridChosen? this.boardService.gridChosen : this.userPageService.currentUser.gridsID[0]);
          this.boardService.updateElementList();
        };


        // UPDATE THE PALETTES
        const paletteStore = db.transaction(['Palette'], 'readwrite');
        const paletteObjectStore = paletteStore.objectStore('Palette');
        const storePaletteRequest = paletteObjectStore.get(this.userPageService.currentUser.id);
        storePaletteRequest.onsuccess = () => {
          paletteObjectStore.put(this.paletteService.palettes, this.userPageService.currentUser.id);
        };


        // UPDATE THE CONFIGURATION
        const configStore = db.transaction(['Configuration'], 'readwrite');
        const configObjectStore = configStore.objectStore('Configuration');
        const storeConfigRequest = configObjectStore.get(this.userPageService.currentUser.id);
        storeConfigRequest.onsuccess = () => {
          configObjectStore.put(this.configurationService.getConfiguration(), this.userPageService.currentUser.id);
        };

      };
    }
  }

  updateConfig(){
    if (this.userPageService.currentUser != null &&
      this.userPageService.currentUser.id != null &&
      this.userPageService.currentUser.id != 1) {

      this.openRequest = indexedDB.open('saveAugcom', 1);

      // ERROR
      this.openRequest.onerror = event => {
        alert('Database error: ' + event.target.errorCode);
      };

      // SUCCESS
      this.openRequest.onsuccess = event => {
        const db = event.target.result;

        // UPDATE THE CONFIGURATION
        const configStore = db.transaction(['Configuration'], 'readwrite');
        const configObjectStore = configStore.objectStore('Configuration');
        const storeConfigRequest = configObjectStore.get(this.userPageService.currentUser.id);
        storeConfigRequest.onsuccess = () => {
          configObjectStore.put(this.configurationService.getConfiguration(), this.userPageService.currentUser.id);
        };
      };
    }
  }

  updateUserList() {
    this.openRequest = indexedDB.open('saveAugcom', 1);

    // ERROR
    this.openRequest.onerror = event => {
      alert('Database error: ' + event.target.errorCode);
    };

    // SUCCESS
    this.openRequest.onsuccess = event => {
      const db = event.target.result;
      // UPDATE THE USER LIST
      const userListStore = db.transaction(['UserList'], 'readwrite');
      const userListObjectStore = userListStore.objectStore('UserList');
      const storeUserListRequest = userListObjectStore.get(1);
      storeUserListRequest.onsuccess = () => {
        userListObjectStore.put(this.userPageService.usersList, 1);
      };
    };
  }


  // INITIALISATION
  loadUsersList() {

    this.openRequest = indexedDB.open('saveAugcom', 1);

    // ERROR
    this.openRequest.onerror = event => {
      alert('Database error: ' + event.target.errorCode);
    };

    // SUCCESS
    this.openRequest.onsuccess = event => {
      const db = event.target.result;
      const gridRequest = db.transaction(['UserList']).objectStore('UserList').get(1);
      gridRequest.onsuccess = e => {
        this.userPageService.usersList = gridRequest.result;
        const loggedUser = localStorage.getItem('logged');
        if (loggedUser != null) {
          let indexOfLogged = parseInt(loggedUser, 10);
          this.userPageService.currentUser = this.userPageService.usersList.find(user => user.id == indexOfLogged);
          this.loadInfoFromCurrentUser();
        }
      };
    };

    // NEW DATABASE VERSION
    this.openRequest.onupgradeneeded = event => {
      // Creaction of Store
      const db = event.target.result;
      const transaction = event.target.transaction;
      this.createUsersListObject(db, transaction);
      this.createPaletteObject(db, transaction);
      this.createConfigurationObject(db, transaction);
      this.createGridObject(db, transaction);
    };
  }


  createPaletteObject(db, transaction) {
    db.createObjectStore('Palette', {autoIncrement: true});
    const paletteStore = transaction.objectStore('Palette');
    paletteStore.add(this.paletteService.palettes);
  }


  createGridObject(db, transaction) {
    db.createObjectStore('Grid', {autoIncrement: true});
    const gridStore = transaction.objectStore('Grid');
    gridStore.add(this.boardService.board);
  }


  createConfigurationObject(db, transaction) {
    db.createObjectStore('Configuration', {autoIncrement: true});
    const configurationStore = transaction.objectStore('Configuration');
    configurationStore.add(this.configurationService.getConfiguration());
  }


  createUsersListObject(db, transaction) {
    db.createObjectStore('UserList', {autoIncrement: true});
    const userList = transaction.objectStore('UserList');
    userList.add(this.userPageService.usersList);
  }


  loadInfoFromCurrentUser() {
    if (this.userPageService.currentUser == null) {
      this.userPageService.currentUser = this.userPageService.defaultUser;
    }
    this.openRequest = indexedDB.open('saveAugcom', 1);

    // ERROR
    this.openRequest.onerror = event => {
      alert('Database error: ' + event.target.errorCode);
    };

    // SUCCESS
    this.openRequest.onsuccess = event => {
      const db = event.target.result;

      //LOAD CONFIGURATION
      const configRequest = db.transaction(['Configuration']).objectStore('Configuration').get(this.userPageService.currentUser.id);
      configRequest.onsuccess = e => {
        let resultConfig = configRequest.result;
        //IF CONFIG DOES NOT EXIST YET FOR THIS USER
        if (resultConfig == null) {
          //GET DEFAULT CONFIG
          resultConfig = this.configurationService.getDefaultConfiguration();
        }
        this.configurationService.setConfiguration(resultConfig);
      };

      //LOAD COLOR PALETTE
      const paletteRequest = db.transaction(['Palette']).objectStore('Palette').get(this.userPageService.currentUser.id);
      paletteRequest.onsuccess = e => {
        let resultedPalette = paletteRequest.result;
        //IF COLOR PALETTE DOES NOT EXIST YET FOR THIS USER
        if (resultedPalette == null) {
          //GET THE DEFAULT COLOR PALETTE
          this.paletteService.palettes = this.paletteService.DEFAULTPALETTELIST;
        }
      };

      //LOAD GRID
      const gridRequest = db.transaction(['Grid']).objectStore('Grid').get(this.userPageService.currentUser.gridsID[0]);
      gridRequest.onsuccess = e => {
        let gridResult = gridRequest.result;
        //IF CONFIG DOES NOT EXIST YET FOR THIS DEFAULT USER
        if (gridResult == null && this.userPageService.currentUser.id == 1) {
          //THIS SHOULD NEVER HAPPEND BUT WE RESET THE BOARD TO BE SURE
          this.boardService.resetBoard();
          //IF CONFIG DOES NOT EXIST YET FOR THIS USER
        } else if (gridResult == null && this.userPageService.currentUser.id != 1) {
          //GET CLEAN DEFAULT USER FROM USER 1' DEFAULT GRID
          let defaultgridRequest = db.transaction(['Grid']).objectStore('Grid').get(1);
          defaultgridRequest.onsuccess = e => {
            this.boardService.board = this.jsonValidator.getCheckedGrid(defaultgridRequest.result);
            this.boardService.updateElementList();
          };
        //ELSE WE JUST TAKE THE SAVED GRID
        } else {
          this.boardService.board = this.jsonValidator.getCheckedGrid(gridResult);
          this.boardService.updateElementList();
        }
        this.boardService.updateElementList();
      };
      if(this.boardService.AFSR){
        this.router.navigate([this.configurationService.LANGUAGE_VALUE + '/keyboard']);
      }
    };
  }


  deleteUserInformation(id: number) {
    this.openRequest = indexedDB.open('saveAugcom', 1);

    // ERROR
    this.openRequest.onerror = event => {
      alert('Database error: ' + event.target.errorCode);
    };

    // SUCCESS
    this.openRequest.onsuccess = event => {
      const db = event.target.result;
      const deleteConfigRequest = db.transaction(['Configuration'], 'readwrite').objectStore('Configuration').delete(id);
      deleteConfigRequest.onsuccess = e => {
        console.log("Config deleted");
      };
      /*
      const deleteGridRequest = db.transaction(['Grid'], 'readwrite').objectStore('Grid').delete(id);
      deleteGridRequest.onsuccess = e => {
        console.log("Grid deleted");
      };
       */

      const deletePaletteRequest = db.transaction(['Palette'], 'readwrite').objectStore('Palette').delete(id);
      deletePaletteRequest.onsuccess = e => {
        console.log("Palette deleted");
      };
    };
  }

  // INITIALISATION
  loadUserOfUsersList(selecteduser: string) {

    this.openRequest = indexedDB.open('saveAugcom', 1);

    // ERROR
    this.openRequest.onerror = event => {
      alert('Database error: ' + event.target.errorCode);
    };

    // SUCCESS
    this.openRequest.onsuccess = event => {
      const db = event.target.result;
      const gridRequest = db.transaction(['UserList']).objectStore('UserList').get(1);
      gridRequest.onsuccess = e => {
        this.userPageService.usersList = gridRequest.result;
        let findUser = this.userPageService.usersList.find(user => user.name.toLowerCase() == selecteduser.toLowerCase());
        if (findUser != null) {
          this.userPageService.currentUser = findUser;
          this.userPageService.setLoggedIn();
          this.loadInfoFromCurrentUser();
        } else {
          let newUserCreated = new User(selecteduser, "", Math.floor(Math.random() * 10000000000) + Date.now());
          this.userPageService.addUser(newUserCreated.name, newUserCreated.base64image);
          this.updateUserList();
          this.loadUserOfUsersList(selecteduser);
        }
      };

    };

    // NEW DATABASE VERSION
    this.openRequest.onupgradeneeded = event => {
      // Creaction of Store
      const db = event.target.result;
      const transaction = event.target.transaction;
      this.createUsersListObject(db, transaction);
      this.createPaletteObject(db, transaction);
      this.createConfigurationObject(db, transaction);
      this.createGridObject(db, transaction);
    };
  }

  loadDefaultGrid(){
    this.openRequest = indexedDB.open('saveAugcom', 1);

    // ERROR
    this.openRequest.onerror = event => {
      alert('Database error: ' + event.target.errorCode);
    };

    // SUCCESS
    this.openRequest.onsuccess = event => {
      const db = event.target.result;
        let defaultgridRequest = db.transaction(['Grid']).objectStore('Grid').get(1);
          defaultgridRequest.onsuccess = e => {
            this.boardService.board = this.jsonValidator.getCheckedGrid(defaultgridRequest.result);
            this.boardService.updateElementList();
          };
          //ELSE WE JUST TAKE THE SAVED GRID
        this.boardService.updateElementList();
      };
  }

  getTargetGrid(idGrid:string):Grid{
    this.openRequest = indexedDB.open('saveAugcom', 1);
    let grid:Grid;

    // ERROR
    this.openRequest.onerror = event => {
      alert('Database error: ' + event.target.errorCode);
    };

    // SUCCESS
    this.openRequest.onsuccess = event => {
      const db = event.target.result;
      let gridRequest = db.transaction(['Grid']).objectStore('Grid').get(idGrid);
      gridRequest.onsuccess = e => {
        console.log('this.jsonValidator.getCheckedGrid(gridRequest.result) :',this.jsonValidator.getCheckedGrid(gridRequest.result));
       return grid = this.jsonValidator.getCheckedGrid(gridRequest.result);
      };
    };
    return grid;
  }

  addGrid(){
    this.openRequest = indexedDB.open('saveAugcom', 1);
    // ERROR
    this.openRequest.onerror = event => {
      alert('Database error: ' + event.target.errorCode);
    };

    // SUCCESS
    this.openRequest.onsuccess = event => {
      const db = event.target.result;
      const gridStore = db.transaction(['Grid'], 'readwrite');
      const gridObjectStore = gridStore.objectStore('Grid');
      gridObjectStore.put(this.boardService.board, this.boardService.board.ID);

      // UPDATE THE USER LIST
      const userListStore = db.transaction(['UserList'], 'readwrite');
      const userListObjectStore = userListStore.objectStore('UserList');
      const storeUserListRequest = userListObjectStore.get(1);
      storeUserListRequest.onsuccess = () => {
        userListObjectStore.put(this.userPageService.usersList, 1);
      };
    };
  }

  changeUserGrid(gridchosen:string){
    this.openRequest = indexedDB.open('saveAugcom', 1);

    // ERROR
    this.openRequest.onerror = event => {
      alert('Database error: ' + event.target.errorCode);
    };

    // SUCCESS
    this.openRequest.onsuccess = event => {
      const db = event.target.result;
      const gridRequest = db.transaction(['Grid']).objectStore('Grid').get(gridchosen);
      gridRequest.onsuccess = e => {
        this.boardService.board = gridRequest.result;
      }
    }
    setTimeout(() => {
      console.log('this.boardService.board : ',this.boardService.board);
      this.boardService.updateElementList();
      this.router.navigate(['keyboard']);
    },200);


  }

  existingGrid():string[]{
    let existingGrid:string[] = [];

    this.openRequest = indexedDB.open('saveAugcom', 1);

    this.openRequest.onsuccess = event => {

      let gridRequest = event.target.result.transaction("Grid").objectStore("Grid");

      gridRequest.openCursor().onsuccess = cursorEvent => {
        let cursor = cursorEvent.target.result;
        if (cursor) {
          existingGrid.push(cursor.key);
          cursor.continue();
        }
      }

    }

    return existingGrid;
  }
}
