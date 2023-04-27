import { CanDeactivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ComponentCanDeactivate {
  canDeactivate: () => boolean | Observable<boolean>;
}

@Injectable()
export class PendingChangesGuard implements CanDeactivate<ComponentCanDeactivate> {
  canDeactivate(component: ComponentCanDeactivate): boolean | Observable<boolean> {
    // if there are no pending changes, just allow deactivation; else confirm first
    if (component.canDeactivate){
      console.log('d');
      return true;
    } else {
      console.log("a");
      let x = confirm('Placeholder; changements non sauvegardés')
      if (x){
        console.log("b");
        return true;
      } else {
        console.log("c");
        window.history.forward();
        return false;
      }
    }
  }
}