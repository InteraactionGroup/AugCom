import {Injectable} from '@angular/core';
import {BoardService} from './board.service';
import {PaletteService} from './palette.service';
import {JsonValidatorService} from './json-validator.service';
import {ConfigurationService} from "./configuration.service";
import {UserPageService} from "./user-page.service";
import {Grid, User} from "../types";

@Injectable({
  providedIn: 'root'
})
export class IndexeddbaccessService {

  openRequest;
  grid: Grid;
  palette;
  configuration;

  constructor(public paletteService: PaletteService,
              public boardService: BoardService,
              public jsonValidator: JsonValidatorService,
              public configurationService: ConfigurationService,
              public userPageService: UserPageService) {
    this.init();
  }

  // UPDATE THE DATABASE
  update() {

    this.openRequest = indexedDB.open('Saves', 1);

    // ERROR
    this.openRequest.onerror = event => {
      alert('Database error: ' + event.target.errorCode);
    };

    // SUCCESS
    this.openRequest.onsuccess = event => {
      const db = event.target.result;

      // if (!db.objectStoreNames.contains('Palette') || !db.objectStoreNames.contains('Grid')) {
      //   this.init();
      // }

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

  updateUserList(){
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

  // INITIALISATION
  init() {

    this.openRequest = indexedDB.open('Saves', 1);

    // ERROR
    this.openRequest.onerror = event => {
      alert('Database error: ' + event.target.errorCode);
    };

    // SUCCESS
    this.openRequest.onsuccess = event => {
      const db = event.target.result;

      this.userPageService.usersList.forEach(user =>{

        const gridStore = db.transaction(['Grid']).objectStore('Grid').get(user.id);
        gridStore.onsuccess = e => {
          this.boardService.board = this.jsonValidator.getCheckedGrid(gridStore.result);
          this.boardService.updateElementList();
        };

        const paletteStore = db.transaction(['Palette']).objectStore('Palette').get(user.id);
        paletteStore.onsuccess = e => {
          this.paletteService.palettes = paletteStore.result;
        };

        const configStore = db.transaction(['Configuration']).objectStore('Configuration').get(user.id);
        configStore.onsuccess = e => {
          this.configurationService.setConfiguration(configStore.result);
        };

        const userList = db.transaction(['UserList']).objectStore('UserList').get(1);
        userList.onsuccess = e => {
          this.userPageService.usersList = userList.result;
          console.log('this.userPageService.usersList',this.userPageService.usersList)
        };
      });


    };

    this.openRequest.onupgradeneeded = event => {

      // Creaction of Store
      const db = event.target.result;
      const transaction = event.target.transaction;

      this.createPaletteObject(db, transaction);
      this.createGridObject(db, transaction);
      this.createConfigurationObject(db, transaction);
      this.createUserObject(db, transaction);

      this.boardService.updateElementList();

    };
  }

  createPaletteObject(db, transaction) {
    db.createObjectStore('Palette', {autoIncrement: true});
    // console.log('palette loaded');
    const paletteStore = transaction.objectStore('Palette');
    paletteStore.add(this.paletteService.palettes);
  }

  createGridObject(db, transaction) {
    db.createObjectStore('Grid', {autoIncrement: true});
    // console.log('save loaded');
    const gridStore = transaction.objectStore('Grid');
    gridStore.add(this.boardService.board);
  }

  createConfigurationObject(db, transaction) {
    db.createObjectStore('Configuration', {autoIncrement: true});
    // console.log('save loaded');
    const configurationStore = transaction.objectStore('Configuration');
    configurationStore.add(this.configurationService.getConfiguration());
  }
  createUserObject(db, transaction) {
    db.createObjectStore('UserList', {autoIncrement: true});
    const userList = transaction.objectStore('UserList');
    userList.add(this.userPageService.usersList);
  }

  getGrid(){

    this.openRequest = indexedDB.open('Saves', 1);

    // ERROR
    this.openRequest.onerror = event => {
      alert('Database error: ' + event.target.errorCode);
    };

    // SUCCESS
    this.openRequest.onsuccess = event => {
      const db = event.target.result;

      const gridRequest =db.transaction(['Grid']).objectStore('Grid').get(this.userPageService.currentUser.id);
      gridRequest.onsuccess = e => {
        console.log('gridRequest.result',gridRequest.result)
        this.grid = gridRequest.result;
      }
    }
  }

  getPalette(){

    this.openRequest = indexedDB.open('Saves', 1);

    // ERROR
    this.openRequest.onerror = event => {
      alert('Database error: ' + event.target.errorCode);
    };

    // SUCCESS
    this.openRequest.onsuccess = event => {
      const db = event.target.result;

      const paletteRequest =db.transaction(['Palette']).objectStore('Palette').get(this.userPageService.currentUser.id);
      paletteRequest.onsuccess = e => {
        console.log('palette.result',paletteRequest.result)
        this.palette = paletteRequest.result;
      }
    }
  }

  getConfiguration(){

    this.openRequest = indexedDB.open('Saves', 1);

    // ERROR
    this.openRequest.onerror = event => {
      alert('Database error: ' + event.target.errorCode);
    };

    // SUCCESS
    this.openRequest.onsuccess = event => {
      const db = event.target.result;

      const configRequest =db.transaction(['Configuration']).objectStore('Configuration').get(this.userPageService.currentUser.id);
      configRequest.onsuccess = e => {
        console.log('configRequest.result',configRequest.result)
        this.configuration = configRequest.result;
      }
    }
  }
  deleteUser(id: string) {
    this.openRequest = indexedDB.open('Saves', 1);

    // ERROR
    this.openRequest.onerror = event => {
      alert('Database error: ' + event.target.errorCode);
    };

    // SUCCESS
    this.openRequest.onsuccess = event => {
      const db = event.target.result;

      const deleteConfigRequest = db.transaction(['Configuration'], 'readwrite').objectStore('Configuration').delete(id);
      deleteConfigRequest.onsuccess = e =>{
        this.configurationService.setConfiguration(deleteConfigRequest.result);
      }

      const deleteGridRequest = db.transaction(['Grid'], 'readwrite').objectStore('Grid').delete(id);
      deleteGridRequest.onsuccess = e => {
        this.boardService.board = this.jsonValidator.getCheckedGrid(deleteGridRequest.result);
        this.boardService.updateElementList();
      };

      const deletePaletteRequest = db.transaction(['Palette'], 'readwrite').objectStore('Palette').delete(id);
      deletePaletteRequest.onsuccess = e => {
        this.paletteService.palettes = deletePaletteRequest.result;
      };
    };
  }
}
