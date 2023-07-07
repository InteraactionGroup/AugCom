import { CanDeactivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ComponentCanDeactivate {
  canDeactivate: () => boolean | Observable<boolean> | Promise<boolean>;
}

@Injectable()
export class PendingChangesGuard implements CanDeactivate<ComponentCanDeactivate> {
  constructor() { }

  /**
   * Guard that checks before the user leaves the page, if any unsaved modification has been made
   * @returns true if (no modification has been made) or if (modifications have been made and the user confirmed his wish to quit), false elsewise 
   */
  canDeactivate(component: ComponentCanDeactivate): boolean | Observable<boolean> | Promise<boolean> {

    return component.canDeactivate ? component.canDeactivate() : true;
  }
}