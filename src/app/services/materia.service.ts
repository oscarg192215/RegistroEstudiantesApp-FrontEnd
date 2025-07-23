import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Materia } from '../models/materia.model';

@Injectable({
  providedIn: 'root'
})
export class MateriaService {
  private apiUrl = 'https://localhost:7000/api/materias/con-profesores';

  constructor(private http: HttpClient) {}

  getMateriasConProfesores(): Observable<Materia[]> {
    return this.http.get<Materia[]>(this.apiUrl);
  }
}