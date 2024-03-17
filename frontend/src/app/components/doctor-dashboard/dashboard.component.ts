import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Specialty } from 'src/app/models/specialty';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { DoctorService } from 'src/app/services/doctor-service/doctor.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile-doctor',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashBoardComponent implements OnInit{

  thisDoctor: User = new User();
  doctor: User = new User();
  errors:string[];
  specialties:Specialty[];
  idDoctor:number;
  image: File | any = null;

  constructor(private login: AuthService, private doctorService: DoctorService, private router: Router, private route: ActivatedRoute){}

  ngOnInit(): void {    
    this.route.paramMap.subscribe(params => {
      let id:number = Number(params.get('id'));
      if(id){
        this.doctorService.getDoctor(id).subscribe(doctor => {
          this.doctor = doctor;
        })
      }
    })
  }

  compararSpecialty(o1:Specialty, o2:Specialty){
    return o1 === null || o2 === null? false: o1.id === o2.id;
  }

  updateDoctor(){
    this.thisDoctor.id = this.doctor.id;
    this.thisDoctor.firstname = this.doctor.firstname;
    this.thisDoctor.lastname = this.doctor.lastname;
    this.thisDoctor.email = this.doctor.email;
    this.thisDoctor.specialty = this.doctor.specialty;

    this.doctorService.updateUser(this.thisDoctor).subscribe({
      next: (json) => {
        window.location.reload();
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Informacion actualizado con éxito.",
          showConfirmButton: false,
          timer: 2000,
        })
        
      },
      error: (err) => {
        this.errors = err.error.errors as string[];
      }
    })
  }
}
