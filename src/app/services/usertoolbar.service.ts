import { Injectable } from '@angular/core';
import {Element} from '../types';
import {Subject} from 'rxjs';
import {ConnectionService} from 'ng-connection-service';

@Injectable({
  providedIn: 'root'
})
export class UsertoolbarService {

  status = 'ONLINE';
  isConnected = true;

  constructor(private connectionService: ConnectionService) {
    document.onfullscreenchange = e => {
      this.full = ! this.full;
    };

    this.connectionService.monitor().subscribe(isConnected => {
      this.isConnected = isConnected;
      if (this.isConnected) {
        this.status = 'ONLINE';
      } else {
        this.status = 'OFFLINE';
      }
    });
  }

  public account = false;
  public unlock = false;
  public share = false;
  public edit = false;
  public babble = false;
  public full = false;
  public setting = false;

  public add = false;
  public modif = null;
  public ElementListener = new Subject<Element>();

  public popup = false;

  fullScreen() {
    if (document.fullscreen || (document as any).webkitIsFullScreen || (document as any).mozFullScreen) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          (document as any).webkitExitFullscreen();
        } else if ((document as any).mozCancelFullScreen) {
          (document as any).mozCancelFullScreen();
      }
    } else {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
        } else if ((document.documentElement as any).webkitRequestFullscreen) {
          (document.documentElement as any).webkitRequestFullscreen();
        } else if ((document.documentElement as any).mozRequestFullScreen) {
          (document.documentElement as any).mozRequestFullScreen();
      }
    }
  }

  editt() {
    this.edit = !this.edit;
  }

}
