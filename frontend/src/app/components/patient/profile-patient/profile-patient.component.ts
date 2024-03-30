import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { PatientService } from 'src/app/services/patient-service/patient.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile-patient',
  templateUrl: './profile-patient.component.html',
  styleUrls: ['./profile-patient.component.css']
})
export class ProfilePatientComponent implements OnInit {

  user: User = new User();
  thisUser: User = new User();
  errors: string[];
  selectedImage: File | any = null;

  constructor(private patientService: PatientService, public login: AuthService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.getUser();
  }

  getUser() {
    this.login.currentUser().subscribe((user: any) => {
      this.login.setUser(user);
      this.user = user;
    })
  }

  updateUser() {
    this.thisUser.id = this.user.id;
    this.thisUser.firstname = this.user.firstname;
    this.thisUser.lastname = this.user.lastname;
    this.thisUser.email = this.user.email;
    this.thisUser.password = this.user.password;

    this.patientService.updatePatient(this.thisUser).subscribe({
      next: (json) => {
        window.location.reload();
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Información actualizada con éxito.",
          showConfirmButton: false,
          timer: 2000,
        })
      },
      error: (err) => {
        this.errors = err.error.errors as string[];
      }
    })
  }

  selectImage(event: any) {
    this.selectedImage = event.target.files[0];
    if (this.selectedImage.type.indexOf('image') < 0) {
      Swal.fire("Error", "La imagen debe ser tipo jpg o png", "error");
      this.selectedImage = null;
    }
  }

  uploadImage() {
    if (!this.selectedImage) {
      Swal.fire("Error", "Debe seleccionar una imagen", "error");
    } else {
      this.patientService.uploadImage(this.selectedImage, this.user.id).subscribe(user => {
        window.location.reload();
        this.getUser();
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Foto de perfil actualizada.",
          showConfirmButton: false,
          timer: 2000
        });
      })
    }
  }
}
