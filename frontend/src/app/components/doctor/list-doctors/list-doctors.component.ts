import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { DoctorService } from 'src/app/services/doctor-service/doctor.service';

@Component({
  selector: 'app-list-doctors',
  templateUrl: './list-doctors.component.html',
  styleUrls: ['./list-doctors.component.css']
})
export class ListDoctorsComponent implements OnInit {

  users: User[] = [];
  doctors: User[] = [];
  thisUser: User = new User();
  paginator: any;
  filterDoctors: string = '';

  constructor(private doctorService: DoctorService, private route: ActivatedRoute, private login: AuthService) { }

  ngOnInit(): void {
    this.getUser();
    this.route.paramMap.subscribe(params => {
      let page: number = Number(params.get('page'));

      if (!page) {
        page = 0;
      }

      this.doctorService.getDoctors().subscribe(doctors => {
        this.users = doctors;;
        for (let doc of this.users) {
          for (let role of doc.roles) {
            if (role.name == 'ROLE_DOCTOR') {
              this.doctors.push(doc);
            }
          }
          if (doc.sex == 'Femenino') {
            doc.specialty = doc.specialty.substring(0, doc.specialty.length - 1);
            doc.specialty = doc.specialty.concat('a');
          }
          if (this.login.isLoggedIn()) {
            this.doctors = this.doctors.filter(
              doc => doc.email !== this.thisUser.email
            );
          } else {
            this.doctors = this.doctors;
          }
        }
      });
    })
  }

  getUser() {
    if (this.login.isLoggedIn()) {
      this.login.currentUser().subscribe((user: any) => {
        this.login.setUser(user);
        this.thisUser = user;
      })
    }
  }

  /*ngOnInit(): void {
    this.doctorService.getDoctors().subscribe(doctors => {
      this.doctors = doctors;
      for(var doc of this.doctors){
        if(doc.specialty != null){
          this.addDoctors.push(doc);
          if(doc.sex == 'Femenino'){
            doc.specialty = doc.specialty.substring(0, doc.specialty.length -1);
            doc.specialty = doc.specialty.concat('a');
          }
        }
      }      
    })
  }*/
}
