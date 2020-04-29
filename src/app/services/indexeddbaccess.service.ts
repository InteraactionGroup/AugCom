import {Injectable} from '@angular/core';
import {BoardService} from './board.service';
import {PaletteService} from './palette.service';

@Injectable({
  providedIn: 'root'
})
export class IndexeddbaccessService {

  openRequest;


  constructor(public paletteService: PaletteService, public boardService: BoardService) {
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
        this.updateBoardColsAndRows();
      };

      // UPDATE THE PALETTES
      const paletteStore = db.transaction(['Palette'], 'readwrite');
      const paletteObjectStore = paletteStore.objectStore('Palette');
      const storePaletteRequest = paletteObjectStore.get(1);
      storePaletteRequest.onsuccess = () => {
        paletteObjectStore.put(this.paletteService.palettes, 1);
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

      // if (!db.transaction(['Grid']).objectStoreNames.contains('Palette') || !db.objectStoreNames.contains('Grid')) {
      //   this.init();
      // }

      const gridStore = db.transaction(['Grid']).objectStore('Grid').get(1);
      gridStore.onsuccess = e => {
        this.boardService.board = gridStore.result;
        this.updateColsAndRowsFromBoard();
      };

      const paletteStore = db.transaction(['Palette']).objectStore('Palette').get(1);
      paletteStore.onsuccess = e => {
        this.paletteService.palettes = paletteStore.result;
      };
    };

    this.openRequest.onupgradeneeded = event => {

      // Creaction of Store
      const db = event.target.result;
      const transaction = event.target.transaction;

      this.createPaletteObject(db,transaction);
      this.createGridObject(db,transaction)

    };
  }

  createPaletteObject(db,transaction){
    db.createObjectStore('Palette', {autoIncrement: true});
    console.log('palette loaded');
    const paletteStore =transaction.objectStore('Palette');
    paletteStore.add(this.paletteService.palettes);
  }

  createGridObject(db,transaction){
    db.createObjectStore('Grid', {autoIncrement: true});
    console.log('save loaded');
    const gridStore = transaction.objectStore('Grid');
    gridStore.add(this.boardService.board);
    this.updateColsAndRowsFromBoard();
  }

  updateColsAndRowsFromBoard() {
    if (this.boardService.board.NumberOfCols !== undefined && this.boardService.board.NumberOfCols != null
      && this.boardService.sliderValueCol !== undefined && this.boardService.sliderValueCol != null) {
      this.boardService.sliderValueCol = this.boardService.board.NumberOfCols;
    }
    if (this.boardService.board.NumberOfRows !== undefined && this.boardService.board.NumberOfRows != null
      && this.boardService.sliderValueRow !== undefined && this.boardService.sliderValueRow != null) {
      this.boardService.sliderValueRow = this.boardService.board.NumberOfRows;
    }
  }

  updateBoardColsAndRows() {
    this.boardService.board.NumberOfCols = this.boardService.sliderValueCol;
    this.boardService.board.NumberOfRows = this.boardService.sliderValueRow;
  }

}
