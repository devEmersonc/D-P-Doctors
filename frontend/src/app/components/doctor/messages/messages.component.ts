import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { DoctorService } from 'src/app/services/doctor-service/doctor.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  user: User = new User();

  constructor(private doctorService: DoctorService, public login: AuthService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.getUser();
  }

  getUser() {
    this.login.currentUser().subscribe((user: any) => {
      this.login.setUser(user);
      this.user = user;
    })
  }

  deleteMessage(message_id: number) {
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
          window.location.reload();
        })
      }
    })
  }
}
