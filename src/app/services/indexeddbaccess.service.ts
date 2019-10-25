import { Injectable } from '@angular/core';
import {BoardService} from "./board.service";

@Injectable({
  providedIn: 'root'
})
export class IndexeddbaccessService {

  request;


  constructor(public boardService: BoardService) {
  }

  update() {
    this.request = indexedDB.open('MyTestDatabase', 1);
    this.request.onerror = event => {
      alert('Database error: ' + event.target.errorCode);
    };

    this.request.onsuccess = event => {
      const db = event.target.result;
      const objectStore = db.transaction(['saves'], 'readwrite').objectStore('saves');
      const requete = objectStore.get(1);
      requete.onsuccess = e => {
        let data = requete.result;
        data = this.boardService.board;
        const requestUpdate = objectStore.put(data, 1);
        requestUpdate.onerror = e1 => {
          // Faire quelque chose avec l’erreur
        };
        requestUpdate.onsuccess = e1 => {
          // Succès - la donnée est mise à jour !
        };
      };
    };
  }

  init() {
    this.request = indexedDB.open('MyTestDatabase', 1);

    this.request.onerror = event => {
      alert('Database error: ' + event.target.errorCode);
    };

    this.request.onsuccess = event => {
      console.log('merci davoir accepté IndexedDB');
      console.log('nous chargons votre dernière sauvegarde');
      const db = event.target.result;
      const requete = db.transaction(['saves']).objectStore('saves').get(1);
      requete.onsuccess = e => {
        this.boardService.board = requete.result;
      };
    };

    this.request.onupgradeneeded = event => {
      console.log('création de votre sauvegarde');
      const db = event.target.result;
      const objectStore = db.createObjectStore('saves', { autoIncrement : true });
      objectStore.transaction.oncomplete = e => {
        console.log('save loaded');
        const gridStore = db.transaction('saves', 'readwrite').objectStore('saves');
        gridStore.add(this.boardService.board);
      };

    };
  }
}
