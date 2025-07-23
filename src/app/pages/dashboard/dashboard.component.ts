import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { MateriaService } from '../../services/materia.service';
import { RegistroService } from '../../services/registro.service';
import { Materia } from '../../models/materia.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  nombreEstudiante: string = '';
  estudianteId?: number;
  materias: Materia[] = [];
  materiasSeleccionadas: Materia[] = [];
  materiasOriginales: Materia[] = [];
  profesoresSeleccionados = new Set<number>();
  puedeAsignar: boolean = false;
  cargando: boolean = false;
  tieneMateriasAsignadas: boolean = false;
  seRealizaronCambios: boolean = false;

  constructor(
    private materiaService: MateriaService,
    private registroService: RegistroService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    const usuario = this.authService.getCurrentUser();
    this.estudianteId = usuario?.id;
    this.nombreEstudiante = usuario?.nombre || '';

    if (!this.estudianteId) return;

    this.cargando = true;

    this.materiaService.getMateriasConProfesores().subscribe({
      next: (materiasApi) => {
        this.materias = materiasApi;

        this.registroService.getMateriasDelEstudiante(this.estudianteId!).subscribe({
          next: (materiasAsignadasIds) => {
            this.materiasSeleccionadas = this.materias.filter(m => materiasAsignadasIds.includes(m.id));
            this.materiasOriginales = [...this.materiasSeleccionadas];
            this.tieneMateriasAsignadas = this.materiasSeleccionadas.length > 0;
            this.profesoresSeleccionados = new Set(this.materiasSeleccionadas.map(m => m.profesorId));
            this.validarAsignacion();
            this.cargando = false;
          },
          error: () => {
            this.cargando = false;
            this.snackBar.open('Error cargando materias asignadas.', 'Cerrar', { duration: 3000 });
          }
        });
      },
      error: () => {
        this.cargando = false;
        this.snackBar.open('Error cargando materias.', 'Cerrar', { duration: 3000 });
      }
    });
  }

  toggleSeleccion(materia: Materia): void {
    const index = this.materiasSeleccionadas.findIndex(m => m.id === materia.id);

    if (index > -1) {
      this.materiasSeleccionadas.splice(index, 1);
    } else {
      if (this.materiasSeleccionadas.length >= 3) {
        this.snackBar.open('Solo puedes seleccionar 3 materias.', 'Cerrar', { duration: 3000 });
        return;
      }

      const profesorRepetido = this.materiasSeleccionadas.some(m => m.profesorId === materia.profesorId);
      if (profesorRepetido) {
        this.snackBar.open('No puedes seleccionar materias con el mismo profesor.', 'Cerrar', { duration: 3000 });
        return;
      }

      this.materiasSeleccionadas.push(materia);
    }

    this.profesoresSeleccionados = new Set(this.materiasSeleccionadas.map(m => m.profesorId));
    this.validarAsignacion();
    this.detectarCambios();
  }

  validarAsignacion(): void {
    const profesoresUnicos = new Set(this.materiasSeleccionadas.map(m => m.profesorId));
    this.puedeAsignar =
      this.materiasSeleccionadas.length === 3 &&
      profesoresUnicos.size === 3;
  }

  detectarCambios(): void {
    const seleccionIds = this.materiasSeleccionadas.map(m => m.id).sort();
    const originalesIds = this.materiasOriginales.map(m => m.id).sort();
    this.seRealizaronCambios = JSON.stringify(seleccionIds) !== JSON.stringify(originalesIds);
  }

  estaSeleccionada(materia: Materia): boolean {
    return this.materiasSeleccionadas.some(m => m.id === materia.id);
  }

  debeDeshabilitar(materia: Materia): boolean {
    const yaSeleccionada = this.estaSeleccionada(materia);
    const profesorYaUsado = this.profesoresSeleccionados.has(materia.profesorId);
    const maximoAlcanzado = this.materiasSeleccionadas.length >= 3;
    return !yaSeleccionada && (profesorYaUsado || maximoAlcanzado);
  }

  isGuardarDeshabilitado(): boolean {
    const profesores = this.materiasSeleccionadas.map(m => m.profesorId);
    const profesoresUnicos = new Set(profesores);
    return this.materiasSeleccionadas.length !== 3 || profesores.length !== profesoresUnicos.size;
  }

  asignarMaterias(): void {
    if (!this.estudianteId || this.materiasSeleccionadas.length !== 3) return;

    this.cargando = true;
    const materiaIds = this.materiasSeleccionadas.map(m => m.id);

    this.registroService.asignarMaterias(this.estudianteId, materiaIds).subscribe({
      next: () => {
        this.snackBar.open('Materias asignadas correctamente.', 'Cerrar', { duration: 3000 });
        this.cargando = false;
        this.tieneMateriasAsignadas = true;
        this.materiasOriginales = [...this.materiasSeleccionadas];
        this.seRealizaronCambios = false;
      },
      error: () => {
        this.snackBar.open('Error al asignar materias.', 'Cerrar', { duration: 3000 });
        this.cargando = false;
      }
    });
  }

  actualizarMaterias(): void {
    if (!this.puedeAsignar || !this.seRealizaronCambios || !this.estudianteId) return;

    this.cargando = true;
    const materiasIds = this.materiasSeleccionadas.map(m => m.id);

    this.registroService.actualizarMaterias(this.estudianteId, materiasIds).subscribe({
      next: () => {
        this.snackBar.open('Materias actualizadas correctamente.', 'Cerrar', { duration: 3000 });
        this.cargando = false;
        this.materiasOriginales = [...this.materiasSeleccionadas];
        this.seRealizaronCambios = false;
        this.router.navigate(['/companeros']);
      },
      error: () => {
        this.snackBar.open('Error: No se pudieron actualizar las materias', 'Cerrar', { duration: 3000 });
        this.cargando = false;
      }
    });
  }

  tieneRegistros(): boolean {
    return this.materiasSeleccionadas.length > 0;
  }
}




