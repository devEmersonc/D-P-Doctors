import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, catchError, throwError, map } from 'rxjs';
import { Message } from 'src/app/models/message';
import { Specialty } from 'src/app/models/specialty';
import { User } from 'src/app/models/user';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  private baseUrl = "http://localhost:8080/api/doctors";

  constructor(private http: HttpClient) { }

  getDoctors(): Observable<User[]>{
    return this.http.get<User[]>(`${this.baseUrl}`);
  }

  pages(page:number): Observable<any>{
    return this.http.get<any>(this.baseUrl + '/page/' + page).pipe(
      map((response:any) => {
        (response.content as User[]).map(user => {
          return user;
        })
        return response;
      })
    );
  }

  existsByEmail(email:string): Observable<User>{
    return this.http.get<User>(this.baseUrl + `/email?email=${email}`);
  }

  getDoctor(id:number): Observable<User>{
    return this.http.get<User>(`${this.baseUrl}/${id}`);
  }

  registerDoctor(doctor:User): Observable<User>{
    return this.http.post<User>(`${this.baseUrl}`, doctor).pipe(
      catchError(e => {
        if(e.status == 400){
          return throwError(() => e);
        }

        Swal.fire(e.error.message, e.error.error, "error");
        return throwError(() => e);
      })
    )
  }

  updateUser(user:User): Observable<any>{
    return this.http.put<any>(`${this.baseUrl}/${user.id}`, user).pipe(
      catchError(e => {
        if(e.status == 400){
          Swal.fire(e.error.message, e.error.error, "error");
          return throwError(() => e);
        }

        Swal.fire(e.error.message, e.error.error, "error");
        return throwError(() => e);
      })
    )
  }

  getSpecialties(): Observable<Specialty[]>{
    return this.http.get<Specialty[]>(`${this.baseUrl}/specialties`);
  }

  uploadImage(image: File, id:any): Observable<User>{
      let formData = new FormData();
      formData.append("image", image);
      formData.append("id", id);

      return this.http.post(`${this.baseUrl}/upload`, formData).pipe(
        map((response : any) => response.user as User),
        catchError(e => {
          Swal.fire(e.error.message, e.error.error, "error");
          return throwError(() => e);
        }) 
      )     
  }
  
  saveFormMessage(message: Message, id:number): Observable<Message>{
    return this.http.post<Message>(`${this.baseUrl}/${id}`, message).pipe(
      catchError(e => {
        if(e.status == 400){
          return throwError(() => e);
        }

        Swal.fire(e.error.message, e.error.error, "error");
        return throwError(() => e);
      })
    )
  }
}
