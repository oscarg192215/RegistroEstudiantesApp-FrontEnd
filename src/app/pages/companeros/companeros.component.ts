import { Component, OnInit } from '@angular/core';
import { RegistroService } from '../../services/registro.service';
import { AuthService } from '../../services/auth.service';
import { MateriaService } from '../../services/materia.service';

interface GrupoCompaneros {
  materiaId: number;
  materiaNombre: string;
  companeros: string[];
}

@Component({
  selector: 'app-companeros',
  standalone: false,
  templateUrl: './companeros.component.html',
  styleUrls: ['./companeros.component.scss']
})
export class CompanerosComponent implements OnInit {
  grupos: GrupoCompaneros[] = [];

  constructor(
    private registroService: RegistroService,
    private authService: AuthService, private materiaService: MateriaService,
  ) {}

  ngOnInit(): void {
    this.cargarMateriasYCompaneros();
  }

  private async cargarMateriasYCompaneros(): Promise<void> {
  const estudianteId = this.authService.getCurrentUser()?.id;

  if (!estudianteId) {
    console.error('Usuario no autenticado');
    return;
  }

  try {
    const materiasIds = await this.registroService.getMateriasDelEstudiante(estudianteId).toPromise();

    if (!materiasIds || materiasIds.length === 0) {
      this.grupos = [];
      return;
    }


    const promesas = materiasIds.map(async (materiaId): Promise<GrupoCompaneros> => {
  const todasMaterias = await this.materiaService.getMateriasConProfesores().toPromise();

  const materia = todasMaterias?.find(m => m.id === materiaId);
  const materiaNombre = materia ? materia.nombre : `Materia ${materiaId}`;

  try {
    const nombres = await this.registroService.getCompaneros(materiaId).toPromise() || [];
    return {
      materiaId,
      materiaNombre,
      companeros: nombres
    };
  } catch (error) {
    console.warn(`Error cargando compañeros para materia ${materiaId}:`, error);
    return {
      materiaId,
      materiaNombre,
      companeros: []
    };
  }
});

    this.grupos = await Promise.all(promesas);

  } catch (error) {
    console.error('Error al cargar datos de compañeros:', error);
    this.grupos = [];
  }
}
}