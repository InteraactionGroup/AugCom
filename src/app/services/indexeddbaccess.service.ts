import {Injectable} from '@angular/core';
import {BoardService} from './board.service';
import {PaletteService} from './palette.service';
import {JsonValidatorService} from './json-validator.service';
import {ConfigurationService} from "./configuration.service";

@Injectable({
  providedIn: 'root'
})
export class IndexeddbaccessService {

  openRequest;

  constructor(public paletteService: PaletteService,
              public boardService: BoardService,
              public jsonValidator: JsonValidatorService,
              public configurationService: ConfigurationService) {
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
      const storeGridRequest = gridObjectStore.get(1);
      storeGridRequest.onsuccess = () => {
        gridObjectStore.put(this.boardService.board, 1);
        this.boardService.updateElementList();
      };

      // UPDATE THE PALETTES
      const paletteStore = db.transaction(['Palette'], 'readwrite');
      const paletteObjectStore = paletteStore.objectStore('Palette');
      const storePaletteRequest = paletteObjectStore.get(1);
      storePaletteRequest.onsuccess = () => {
        paletteObjectStore.put(this.paletteService.palettes, 1);
      };

      // UPDATE THE CONFIGURATION
      const configStore = db.transaction(['Configuration'], 'readwrite');
      const configObjectStore = configStore.objectStore('Configuration');
      const storeConfigRequest = configObjectStore.get(1);
      storeConfigRequest.onsuccess = () => {
        configObjectStore.put(this.configurationService.getConfiguration(), 1);
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

      const gridStore = db.transaction(['Grid']).objectStore('Grid').get(1);
      gridStore.onsuccess = e => {
        this.boardService.board = this.jsonValidator.getCheckedGrid(gridStore.result);
        this.boardService.updateElementList();
      };

      const paletteStore = db.transaction(['Palette']).objectStore('Palette').get(1);
      paletteStore.onsuccess = e => {
        this.paletteService.palettes = paletteStore.result;
      };

      const configStore = db.transaction(['Configuration']).objectStore('Configuration').get(1);
      configStore.onsuccess = e => {
        this.configurationService.setConfiguration(configStore.result);
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

  setDefaultConfiguration(){
    this.openRequest = indexedDB.open('Saves', 1);

    // ERROR
    this.openRequest.onerror = event => {
      alert('Database error: ' + event.target.errorCode);
    };

    // SUCCESS
    this.openRequest.onsuccess = event => {
      const db = event.target.result;

      const configRequest = db.transaction(['Configuration']).objectStore('Configuration').get(1);
      configRequest.onsuccess = e => {
        this.configurationService.setConfiguration(configRequest.result);
      }
    }
  }
}
