import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { User } from "../types";

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  currentUserAuth: User;

  constructor(private router: Router) { }

  /**
   * Before the user accesses a protected page (see App routing module), checks if he is logged in. If not prevents the user from accessing said page 
   * @returns true if user is logged in, else sends the user to the logging page
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (localStorage.getItem('logged') !== undefined) {
      this.currentUserAuth = new User(localStorage.getItem('name'), localStorage.getItem('image'), localStorage.getItem('logged'))
      return true;
    }
    else {
      this.router.navigate(['/logging']);
    }
  }
}
