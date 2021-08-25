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
    if(this.userPageService.currentUser != null &&
      this.userPageService.currentUser.id != null &&
      this.userPageService.currentUser.id != 1) {
      console.log("default");

      this.openRequest = indexedDB.open('Saves', 1);

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

  //DONE
  updateUserList() {
    this.openRequest = indexedDB.open('Saves', 1);

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

  //DONE
  // INITIALISATION
  loadUsersList() {

    this.openRequest = indexedDB.open('Saves', 1);

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
        console.log("HERE IS THE USER LIST");
        console.log(this.userPageService.usersList);
        const loggedUser = localStorage.getItem('logged');
        if (  loggedUser != null){
          let indexOfLogged = parseInt(loggedUser,10);
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

  //DONE
  createPaletteObject(db, transaction) {
    db.createObjectStore('Palette', {autoIncrement: true});
    const paletteStore = transaction.objectStore('Palette');
    paletteStore.add(this.paletteService.palettes);
  }

  //DONE
  createGridObject(db, transaction) {
    db.createObjectStore('Grid', {autoIncrement: true});
    const gridStore = transaction.objectStore('Grid');
    gridStore.add(this.boardService.board);
  }

  //DONE
  createConfigurationObject(db, transaction) {
    db.createObjectStore('Configuration', {autoIncrement: true});
    const configurationStore = transaction.objectStore('Configuration');
    configurationStore.add(this.configurationService.getConfiguration());
  }

  //DONE
  createUsersListObject(db, transaction) {
    db.createObjectStore('UserList', {autoIncrement: true});
    const userList = transaction.objectStore('UserList');
    userList.add(this.userPageService.usersList);
  }

  //DONE
  loadInfoFromCurrentUser() {
    if(this.userPageService.currentUser==null) {
      this.userPageService.currentUser = this.userPageService.defaultUser;
    }
      this.openRequest = indexedDB.open('Saves', 1);

      // ERROR
      this.openRequest.onerror = event => {
        alert('Database error: ' + event.target.errorCode);
      };

      // SUCCESS
      this.openRequest.onsuccess = event => {
        const db = event.target.result;

        const configRequest = db.transaction(['Configuration']).objectStore('Configuration').get(this.userPageService.currentUser.id);
        configRequest.onsuccess = e => {
          console.log("success conf user " + this.userPageService.currentUser.name);
          let resultConfig = configRequest.result;
          if (resultConfig == null) {
            console.log("success grid user null " + this.userPageService.currentUser.name);
            resultConfig = this.configurationService.getDefaultConfiguration();
          }
          this.configurationService.setConfiguration(resultConfig);
        };
        const paletteRequest = db.transaction(['Palette']).objectStore('Palette').get(this.userPageService.currentUser.id);
        paletteRequest.onsuccess = e => {
          console.log("success palette user " + this.userPageService.currentUser.name);
          let resultedPalette = paletteRequest.result;
          if (resultedPalette == null) {
            console.log("success palette user null " + this.userPageService.currentUser.name);
            this.paletteService.palettes = this.paletteService.DEFAULTPALETTELIST;
          }
        };
        const gridRequest = db.transaction(['Grid']).objectStore('Grid').get(this.userPageService.currentUser.id);
        gridRequest.onsuccess = e => {
          console.log("success grid user " + this.userPageService.currentUser.name);
          let gridResult = gridRequest.result;
          if (gridResult == null) {
            console.log("success grid user null" + this.userPageService.currentUser.name);
            this.boardService.resetBoard();
          } else {
            this.boardService.board = this.jsonValidator.getCheckedGrid(gridResult);
          }
          this.boardService.updateElementList();
        };
      };
  }

  //DONE
  deleteUserInformation(id: number) {
    this.openRequest = indexedDB.open('Saves', 1);

    // ERROR
    this.openRequest.onerror = event => {
      alert('Database error: ' + event.target.errorCode);
    };

    // SUCCESS
    this.openRequest.onsuccess = event => {
      const db = event.target.result;
      const deleteConfigRequest = db.transaction(['Configuration'], 'readwrite').objectStore('Configuration').delete(id);
      deleteConfigRequest.onsuccess = e => {
        console.log("DELETE CONFIG");
      };
        const deleteGridRequest = db.transaction(['Grid'], 'readwrite').objectStore('Grid').delete(id);
      deleteGridRequest.onsuccess = e => {
        console.log("DELETE GRID");
      };

      const deletePaletteRequest =  db.transaction(['Palette'], 'readwrite').objectStore('Palette').delete(id);
      deletePaletteRequest.onsuccess = e => {
        console.log("DELETE PALETTE");
      };
    };
  }
}
