import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { DoctorService } from 'src/app/services/doctor-service/doctor.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit{

  doctor: User = new User();

  constructor(private doctorService: DoctorService, public login: AuthService, private router: Router){}

  ngOnInit(): void {
    if(this.login.isLoggedIn()){
      this.login.getCurrentUser().subscribe((user:any) => {
        this.login.setUser(user);
        this.doctor = user;
      })
    }
  }
  

  public dashboard(){
    if(this.login.getUserRole() == 'ROLE_DOCTOR'){
      this.router.navigate(['/profile']);
    }else if(this.login.getUserRole() == 'ROLE_PATIENT'){
      this.router.navigate(['/profile-patient']);
    }
  }

  public logout(){
    this.login.logout();
    this.router.navigate(['/'])
  }
}
