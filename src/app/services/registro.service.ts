import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistroService {
  private apiUrl = 'https://localhost:7000/api/registros';

  constructor(private http: HttpClient) {}

  asignarMaterias(estudianteId: number, materiasIds: number[]): Observable<any> {
    return this.http.post(this.apiUrl, { estudianteId, materiasIds });
  }
  actualizarMaterias(estudianteId: number, materiasIds: number[]): Observable<void> {
  const body = { MateriasIds: materiasIds };
  return this.http.patch<void>(`${this.apiUrl}/estudiante/${estudianteId}`, body);
}
  getMateriasDelEstudiante(estudianteId: number): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiUrl}/estudiante/${estudianteId}`);
  }
  getCompaneros(materiaId: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/companeros/${materiaId}`);
  }
}