import { CanDeactivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ComponentCanDeactivate {
  canDeactivate: () => boolean | Observable<boolean> | Promise<boolean>;
}

@Injectable()
export class PendingChangesGuard implements CanDeactivate<ComponentCanDeactivate> {
  constructor(){}

   canDeactivate(component: ComponentCanDeactivate): boolean | Observable<boolean> | Promise<boolean> {
    // if there are no pending changes, just allow deactivation; else confirm first
    

    return component.canDeactivate ? component.canDeactivate() : true;
  }
}