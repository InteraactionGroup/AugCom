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
      console.log('this.userPageService.currentUser :',this.userPageService.currentUser);
      console.log('localStorage.getItem(\'logged\') :',localStorage.getItem('logged'));
      if (this.userPageService.currentUser !== undefined) {
        const storeGridRequest = gridObjectStore.get(this.userPageService.currentUser.id);
        storeGridRequest.onsuccess = () => {
          gridObjectStore.put(this.boardService.board, this.userPageService.currentUser.id);
          this.boardService.updateElementList();
        };
      } else {
        const storeGridRequest = gridObjectStore.get(localStorage.getItem('logged'));
        storeGridRequest.onsuccess = () => {
          gridObjectStore.put(this.boardService.board, localStorage.getItem('logged'));
          this.boardService.updateElementList();
        };
      }


      // UPDATE THE PALETTES
      const paletteStore = db.transaction(['Palette'], 'readwrite');
      const paletteObjectStore = paletteStore.objectStore('Palette');
      if (this.userPageService.currentUser !== undefined) {
        const storePaletteRequest = paletteObjectStore.get(this.userPageService.currentUser.id);
        storePaletteRequest.onsuccess = () => {
          paletteObjectStore.put(this.paletteService.palettes, this.userPageService.currentUser.id);
        };
      } else {
        const storePaletteRequest = paletteObjectStore.get(localStorage.getItem('logged'));
        storePaletteRequest.onsuccess = () => {
          paletteObjectStore.put(this.paletteService.palettes, localStorage.getItem('logged'));
        };
      }


      // UPDATE THE CONFIGURATION
      const configStore = db.transaction(['Configuration'], 'readwrite');
      const configObjectStore = configStore.objectStore('Configuration');
      if (this.userPageService.currentUser !== undefined) {
        const storeConfigRequest = configObjectStore.get(this.userPageService.currentUser.id);
        storeConfigRequest.onsuccess = () => {
          configObjectStore.put(this.configurationService.getConfiguration(), this.userPageService.currentUser.id);
        };
      } else {
        const storeConfigRequest = configObjectStore.get(localStorage.getItem('logged'));
        storeConfigRequest.onsuccess = () => {
          configObjectStore.put(this.configurationService.getConfiguration(), localStorage.getItem('logged'));
        };
      }

    };
  }

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


      const gridRequest = db.transaction(['UserList']).objectStore('UserList').get(1);
      gridRequest.onsuccess = e => {

        this.userPageService.usersList = gridRequest.result;
      }
      setTimeout(() => {
        console.log('this.userPageService.usersList', this.userPageService.usersList);
        this.userPageService.usersList.forEach(user => {

          const gridStore = db.transaction(['Grid']).objectStore('Grid').get(user.id);
          gridStore.onsuccess = e => {
            this.boardService.board = this.jsonValidator.getCheckedGrid(gridStore.result);
            this.grid = this.boardService.board;
            this.boardService.updateElementList();
          };

          const paletteStore = db.transaction(['Palette']).objectStore('Palette').get(1);
          paletteStore.onsuccess = e => {
            this.paletteService.palettes = paletteStore.result;
            this.palette = this.paletteService.palettes;
          };

          const configStore = db.transaction(['Configuration']).objectStore('Configuration').get(1);
          configStore.onsuccess = e => {
            this.configurationService.setConfiguration(configStore.result);
            this.configuration = this.configurationService.getConfiguration();
          };

          const userList = db.transaction(['UserList']).objectStore('UserList').get(1);
          userList.onsuccess = e => {
            this.userPageService.usersList = userList.result;
          };
        });
      }, 500)
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

  getGrid() {

    this.openRequest = indexedDB.open('Saves', 1);

    // ERROR
    this.openRequest.onerror = event => {
      alert('Database error: ' + event.target.errorCode);
    };

    // SUCCESS
    this.openRequest.onsuccess = event => {
      const db = event.target.result;

      const gridRequest = db.transaction(['Grid']).objectStore('Grid').get(this.userPageService.currentUser.id);
      gridRequest.onsuccess = e => {
        this.grid = gridRequest.result;
      }
    }
  }

  getPalette() {

    this.openRequest = indexedDB.open('Saves', 1);

    // ERROR
    this.openRequest.onerror = event => {
      alert('Database error: ' + event.target.errorCode);
    };

    // SUCCESS
    this.openRequest.onsuccess = event => {
      const db = event.target.result;

      const paletteRequest = db.transaction(['Palette']).objectStore('Palette').get(this.userPageService.currentUser.id);
      paletteRequest.onsuccess = e => {
        this.palette = paletteRequest.result;
      }
    }
  }

  getConfiguration() {

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
        this.configuration = configRequest.result;
      }
    }
  }

  getAllFromUser() {
    this.openRequest = indexedDB.open('Saves', 1);

    // ERROR
    this.openRequest.onerror = event => {
      alert('Database error: ' + event.target.errorCode);
    };

    // SUCCESS
    this.openRequest.onsuccess = event => {
      const db = event.target.result;

      const gridRequest = db.transaction(['Grid']).objectStore('Grid').get(this.userPageService.currentUser.id);
      gridRequest.onsuccess = e => {
        this.grid = gridRequest.result;
      }
      const configRequest = db.transaction(['Configuration']).objectStore('Configuration').get(this.userPageService.currentUser.id);
      configRequest.onsuccess = e => {
        this.configuration = configRequest.result;
      }
      const paletteRequest = db.transaction(['Palette']).objectStore('Palette').get(this.userPageService.currentUser.id);
      paletteRequest.onsuccess = e => {
        this.palette = paletteRequest.result;
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
      deleteConfigRequest.onsuccess = e => {
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

  initDefault() {

    this.openRequest = indexedDB.open('Saves', 1);

    // ERROR
    this.openRequest.onerror = event => {
      alert('Database error: ' + event.target.errorCode);
    };

    // SUCCESS
    this.openRequest.onsuccess = event => {
      const db = event.target.result;

      const gridStore = db.transaction(['Grid']).objectStore('Grid').get(1);
      gridStore.onsuccess = e => {
        this.boardService.board = this.jsonValidator.getCheckedGrid(gridStore.result);
        this.grid = this.boardService.board;
        this.boardService.updateElementList();
      };

      const paletteStore = db.transaction(['Palette']).objectStore('Palette').get(1);
      paletteStore.onsuccess = e => {
        this.paletteService.palettes = paletteStore.result;
        this.palette = this.paletteService.palettes
      };

      const configStore = db.transaction(['Configuration']).objectStore('Configuration').get(1);
      configStore.onsuccess = e => {
        this.configurationService.setConfiguration(configStore.result);
        this.configuration = this.configurationService.getConfiguration();
      };
    };

    this.openRequest.onupgradeneeded = event => {

      // Creaction of Store
      const db = event.target.result;
      const transaction = event.target.transaction;

      this.createPaletteObject(db, transaction);
      this.createGridObject(db, transaction);
      this.createConfigurationObject(db, transaction);

      this.boardService.updateElementList();

    };
  }
}
