import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { DoctorService } from 'src/app/services/doctor-service/doctor.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  doctor: User = new User();
  errors: string[];
  sexes: string[] = ["Masculino", "Femenino"];
  specialties: string[] = ["Cardiólogo", "Ginecólogo", "Neurólogo", "Pediatra", "Radiólogo", "Dermatólogo", "Nutricionista", "Psicólogo", "kinesiólogo", "Fonoaudiólogo", "Dentista", "Oftalmólogo"];

  constructor(private doctorService: DoctorService, private router: Router) { }

  ngOnInit(): void {

  }

  registerDoctor() {
    this.doctorService.registerDoctor(this.doctor).subscribe({
      next: (json) => {
        this.router.navigate(['/login'])
        Swal.fire("Registro exitoso!");
      },
      error: (err) => {
        this.errors = err.error.errors as string[];
      }
    })
  }
}
