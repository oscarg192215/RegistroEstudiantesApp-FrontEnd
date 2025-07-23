import { Component, HostListener, OnDestroy } from '@angular/core';
import { AuthService } from './services/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss'
})
export class AppComponent  implements OnDestroy {
  title = 'RegistroEstudiantesApp-Frontend';  
 

  constructor(private authService: AuthService) {}

  @HostListener('window:beforeunload', ['$event'])
  handleBeforeUnload(event: Event): void {
    this.logoutSilencioso();
  }

  logoutSilencioso(): void {
    if (this.authService.getCurrentUser()) {
      this.authService.logout(); 
    }
  }

  ngOnDestroy(): void {
    this.logoutSilencioso();
  }
}
