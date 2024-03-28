import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { DoctorService } from 'src/app/services/doctor-service/doctor.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  user: User = new User();

  constructor(private doctorService: DoctorService, private route: ActivatedRoute, public login: AuthService) { }

  ngOnInit(): void {
    this.getUser();
  }

  getUser() {
    if (this.login.isLoggedIn()) {
      this.route.paramMap.subscribe(params => {
        let id: number = Number(params.get('id'));
        if (id) {
          this.doctorService.getDoctor(id).subscribe(user => {
            this.user = user;
          })
        }
      })
    }
  }
}
