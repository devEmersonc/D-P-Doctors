import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Message } from 'src/app/models/message';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { DoctorService } from 'src/app/services/doctor-service/doctor.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-details-message',
  templateUrl: './details-message.component.html',
  styleUrls: ['./details-message.component.css']
})
export class DetailsMessageComponent implements OnInit{

  doctor:User = new User();
  message:Message = new Message();

  constructor(public login:AuthService, private router: Router, private doctorService: DoctorService, private route: ActivatedRoute){}

  ngOnInit(): void {
    if(this.login.isLoggedIn()){
      this.getMessage();
    }else{
      this.router.navigate(['/']);
    }
  }

  getUser(){
   this.login.currentUser().subscribe((user:any) => {
    this.login.setUser(user);
    this.doctor = user;
   }) 
  }

  getMessage(){
    this.route.paramMap.subscribe(params => {
      let id:number = Number(params.get('id'));
      if(id){
        this.doctorService.getMessage(id).subscribe(message => {
          this.message = message;
          window.scrollTo({
            top:0,
            left:0,
            behavior: 'smooth'
          });
        })
      }
    })
  }

  deleteMessage(message_id:number){
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    
    swalWithBootstrapButtons.fire({
      title: '¿Está seguro?',
      text: `¿Seguro que desea eliminar el mensaje?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'No, cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.doctorService.deleteMessage(message_id).subscribe(dato => {

          swalWithBootstrapButtons.fire(
            'mensaje eliminado!',
            'success'
          )
          this.router.navigate(['/messages'])
        })
      }      
    })
  }
}
