import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { DoctorService } from 'src/app/services/doctor-service/doctor.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit{

  doctors:User[] = [];
  addDoctors:User[] = [];
  arrayDoctors:User[] = [];
  arr:User[] = [];
  doc: User = new User();

  constructor(private doctorService: DoctorService, public auth: AuthService, private router: Router){}

  ngOnInit(): void {
    this.doc = this.auth.getUser();
    this.doctorService.getDoctors().subscribe(doctors => {
      this.doctors = doctors;
      for(var doctor of this.doctors){
        if(doctor.sex == "Femenino"){
          doctor.specialty = doctor.specialty.substring(0, doctor.specialty.length -1);
          doctor.specialty = doctor.specialty.concat('a');      
        }
        if(this.auth.isLoggedIn()){
          this.doctors = this.doctors.filter(
            doc => doc.email !== this.doc.email            
          );
          this.addDoctors = this.doctors.slice(0, 6);
        }else{
          this.addDoctors = this.doctors.slice(0,6)
        }
      }
    })
  }

  /*ngOnInit(): void {
    this.doc = this.auth.getUser();
    this.doctorService.getDoctors().subscribe(doctors => {
      this.doctors = doctors;
      for(var doctor of this.doctors){
        if(doctor.sex == "Femenino"){
          doctor.specialty = doctor.specialty.substring(0, doctor.specialty.length -1);
          doctor.specialty = doctor.specialty.concat('a');      
        }        
        this.addDoctors = this.doctors.slice(0, 6)
      }
    })
  }*/
}