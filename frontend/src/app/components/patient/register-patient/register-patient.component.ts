import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { PatientService } from 'src/app/services/patient-service/patient.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register-patient',
  templateUrl: './register-patient.component.html',
  styleUrls: ['./register-patient.component.css']
})
export class RegisterPatientComponent implements OnInit {

  patient: User = new User();
  errors: string[];

  constructor(private patientService: PatientService, private router: Router) { }

  ngOnInit(): void {

  }

  registerPatient() {
    this.patientService.registerPatient(this.patient).subscribe({
      next: (json) => {
        this.router.navigate(['/login']);
        Swal.fire("Registro exitoso!");
      },
      error: (err) => {
        this.errors = err.error.errors as string[];
      }
    })
  }
}
