import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { DoctorService } from 'src/app/services/doctor-service/doctor.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  credencialesInva: string = "";

  loginData = {
    "email": "",
    "password": ""
  }

  user:User = new User();
  errors:string[] = [];

  constructor(private login: AuthService, private router: Router, private doctorService: DoctorService){}

  ngOnInit(): void {
    
  }

  formSubmitLogin(){
        this.login.generateToken(this.loginData).subscribe(
          (data: any) => {
            this.login.loginUser(data.token);
            this.login.getCurrentUser().subscribe((user:any) => {
              this.login.setUser(user);
    
              if(this.login.getUserRole() == "ROLE_DOCTOR"){
                window.location.href = '/';
              }
              else if(this.login.getUserRole() == "ROLE_PATIENT"){
      
                window.location.href = '/';
              }
              else{
                this.login.logout();
              }
            })
          },(error) => {
            this.errors = error.error.errors as string[];
          }
        )    
  }
}