
// import { Injectable } from '@angular/core';
// import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
// import { AuthService } from '../services/auth.service';
// import { isPlatformBrowser } from '@angular/common';
// import { PLATFORM_ID, Inject } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthGuard implements CanActivate {

//   constructor(
//     private authService: AuthService,
//     private router: Router,
//     @Inject(PLATFORM_ID) private platformId: Object
//   ) {}

//   canActivate(
//     route: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot): boolean {

//     if (!isPlatformBrowser(this.platformId)) {
//       return false;
//     }

//     const isAuthenticated = this.authService.isLoggedIn();

//     if (!isAuthenticated) {
//       this.router.navigate(['/login'], {
//         queryParams: { returnUrl: state.url }
//       });
//       return false;
//     }

//     return true;
//   }
// }



import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, inject } from '@angular/core';

export const AuthGuard: CanActivateFn = (route, state) => {
  // Inyecta servicios
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // Asegurarse de que estamos en el navegador
  if (!isPlatformBrowser(platformId)) {
    return false;
  }

  
  if (authService.isLoggedIn()) {
    return true;
  } else {
    
    router.navigate(['/login'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }
};

