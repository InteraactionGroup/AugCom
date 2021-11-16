import {Injectable} from '@angular/core';
import {BoardService} from './board.service';
import {PaletteService} from './palette.service';
import {JsonValidatorService} from './json-validator.service';
import {ConfigurationService} from "./configuration.service";
import {UserPageService} from "./user-page.service";
import {Grid} from "../types";

@Injectable({
  providedIn: 'root'
})
export class IndexeddbaccessService {

  openRequest;
  currentConfiguration;

  constructor(public paletteService: PaletteService,
              public boardService: BoardService,
              public jsonValidator: JsonValidatorService,
              public configurationService: ConfigurationService,
              public userPageService: UserPageService) {
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
        const storeGridRequest = gridObjectStore.get(this.userPageService.currentUser.id);
        storeGridRequest.onsuccess = () => {
          gridObjectStore.put(this.boardService.board, this.userPageService.currentUser.id);
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
      const gridRequest = db.transaction(['Grid']).objectStore('Grid').get(this.userPageService.currentUser.id);
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
      const deleteGridRequest = db.transaction(['Grid'], 'readwrite').objectStore('Grid').delete(id);
      deleteGridRequest.onsuccess = e => {
        console.log("Grid deleted");
      };

      const deletePaletteRequest = db.transaction(['Palette'], 'readwrite').objectStore('Palette').delete(id);
      deletePaletteRequest.onsuccess = e => {
        console.log("Palette deleted");
      };
    };
  }
}
