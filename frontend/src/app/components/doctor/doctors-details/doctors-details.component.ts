import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Message } from 'src/app/models/message';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { DoctorService } from 'src/app/services/doctor-service/doctor.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-doctors-details',
  templateUrl: './doctors-details.component.html',
  styleUrls: ['./doctors-details.component.css']
})
export class DoctorsDetailsComponent implements OnInit{
  
  doctor: User = new User();
  message: Message = new Message();
  errors: string[];

  constructor(public login: AuthService, private doctorService: DoctorService, private route: ActivatedRoute, private router: Router){}
  
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {            
      let id:number = Number(params.get('id'));
      if(id){
        this.doctorService.getDoctor(id).subscribe(doctor => {
          this.doctor = doctor;
          window.scrollTo({
            top:0,
            left:0,
            behavior: 'smooth'
          });
          if(doctor.sex == 'Femenino'){
            doctor.specialty = doctor.specialty.substring(0, doctor.specialty.length -1);
            doctor.specialty = doctor.specialty.concat('a');
          }
        })
      }
    })
  }

  saveFormMessage(){
    this.doctorService.saveFormMessage(this.message, this.doctor.id).subscribe({
      next: (json) => {  
        window.location.reload();      
        Swal.fire({
          position: "center",
          icon: "success",
          title: "¡Mensaje enviado con éxito!",
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
