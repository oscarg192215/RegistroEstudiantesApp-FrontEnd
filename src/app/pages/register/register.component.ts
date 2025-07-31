import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    private router: Router,
    private snackBar: MatSnackBar
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
          this.snackBar.open('Registro exitoso. ¡Puedes iniciar sesión!', 'Cerrar', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });

          localStorage.clear();
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.cargando = false;
          const mensaje = err.error?.message || 'No se pudo completar el registro. Intente nuevamente.';
          this.snackBar.open(mensaje, 'Cerrar', {
            duration: 6000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }
}