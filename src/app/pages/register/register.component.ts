import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  cargando: boolean = false; 

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      nombre: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onRegister() {
    if (this.registerForm.valid) {
      this.cargando = true; 
      const { nombre, email, password } = this.registerForm.value;
      const estudiante = { nombre, email, password };

      this.authService.register(estudiante).subscribe({
        next: () => {
          this.cargando = false; 
          localStorage.clear();
          this.router.navigate(['/login']); 
        },
        error: (err) => {
          this.cargando = false; 
          console.error('Error:', err);
        }
      });
    }
  }
}


