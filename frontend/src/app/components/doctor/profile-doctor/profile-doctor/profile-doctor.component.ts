import { Component, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { DoctorService } from 'src/app/services/doctor-service/doctor.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile-doctor',
  templateUrl: './profile-doctor.component.html',
  styleUrls: ['./profile-doctor.component.css']
})
export class ProfileDoctorComponent implements OnInit{

  user:User = new User();
  thisuser:User = new User();
  errors:string[];
  selectedImage: File | any = null;
  specialties:string[] = ["Cardiólogo", "Ginecólogo", "Neurólogo", "Pediatra", "Radiólogo", "Dermatólogo", "Nutricionista", "Psicólogo", "kinesiólogo", "Fonoaudiólogo", "Dentista", "Oftalmólogo"];

  constructor(private doctorService: DoctorService, private route: ActivatedRoute, public login: AuthService, private router:Router){}

  ngOnInit(): void {
    this.getUser();
  }

  getUser(){
    this.login.currentUser().subscribe((user:any) => {
      this.login.setUser(user);
      this.user = user;
    })
  }

  updateUser(){
    this.thisuser.id = this.user.id;
    this.thisuser.firstname = this.user.firstname;
    this.thisuser.lastname = this.user.lastname;
    this.thisuser.email = this.user.email;
    this.thisuser.photo = this.user.photo;
    this.thisuser.phone = this.user.phone;
    this.thisuser.sex = this.user.sex;
    this.thisuser.specialty = this.user.specialty;

    this.doctorService.updateUser(this.thisuser).subscribe({
      next: (json) => {    
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

  selectImage(event: any){
    this.selectedImage = event.target.files[0];
    if(this.selectedImage.type.indexOf('image') < 0){
      Swal.fire("Error: ", "La imagen debe ser tipo jpg o png", "error");
      this.selectedImage = null;
    }
  }

  uploadImage(){
    if(!this.selectedImage){
      Swal.fire("Error", "Debe seleccionar una imagen", "error");
    }else{
      this.doctorService.uploadImage(this.selectedImage, this.user.id).subscribe(user => {
        this.router.navigate(['/profile', this.user.id])
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