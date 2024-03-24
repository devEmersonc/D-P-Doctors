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
    return this.http.get<User[]>(`${this.baseUrl}/all-doctors`);
  }

      //Paginator      
  /*pages(page:number): Observable<any>{
    return this.http.get<any>(this.baseUrl + '/page/' + page).pipe(
      map((response:any) => {
        (response.content as User[]).map(user => {
          return user;
        })
        return response;
      })
    );
  }*/

  getMessage(message_id:number): Observable<Message>{
    return this.http.get<Message>(this.baseUrl + `/message/` + message_id);
  }

  existsByEmail(email:string): Observable<User>{
    return this.http.get<User>(this.baseUrl + `/doctor/email?email=${email}`);
  }

  getDoctor(id:number): Observable<User>{
    return this.http.get<User>(`${this.baseUrl}/doctor/${id}`);
  }

  registerDoctor(doctor:User): Observable<User>{
    return this.http.post<User>(`${this.baseUrl}/register`, doctor).pipe(
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
    return this.http.put<any>(`${this.baseUrl}/update/${user.id}`, user).pipe(
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

      return this.http.post(`${this.baseUrl}/upload/image`, formData).pipe(
        map((response : any) => response.user as User),
        catchError(e => {
          Swal.fire(e.error.message, e.error.error, "error");
          return throwError(() => e);
        }) 
      )     
  }
  
  saveFormMessage(message: Message, id:number): Observable<Message>{
    return this.http.post<Message>(`${this.baseUrl}/message/${id}`, message).pipe(
      catchError(e => {
        if(e.status == 400){
          return throwError(() => e);
        }

        Swal.fire(e.error.message, e.error.error, "error");
        return throwError(() => e);
      })
    )
  }

  deleteMessage(message_id:number){
    return this.http.delete(`${this.baseUrl}/delete/message/${message_id}`).pipe(
      catchError(e => {
        if(e.status == 400){
          return throwError(() => e);
        }

        Swal.fire(e.error.message, e.error.error, "error");
        return throwError(() => e);
      })
    );
  }
}
