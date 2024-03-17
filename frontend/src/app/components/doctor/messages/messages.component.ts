import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { DoctorService } from 'src/app/services/doctor-service/doctor.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit{

  user: User = new User();

  constructor(private doctorService: DoctorService, public login: AuthService, private route: ActivatedRoute){}

  ngOnInit(): void {
    let id = this.route.snapshot.params['id'];
    if(id){
      this.doctorService.getDoctor(id).subscribe(user => {
        this.user = user;
      })
    }
  }
}
