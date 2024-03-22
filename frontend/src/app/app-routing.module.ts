import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './components/doctor/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { DashBoardComponent } from './components/doctor-dashboard/dashboard.component';
import { doctorGuard } from './services/doctor.guard';
import { InicioComponent } from './components/inicio/inicio.component';
import { DoctorsDetailsComponent } from './components/doctor/doctors-details/doctors-details.component';
import { ProfileDoctorComponent } from './components/doctor/profile-doctor/profile-doctor/profile-doctor.component';
import { MessagesComponent } from './components/doctor/messages/messages.component';
import { FormRegisterComponent } from './components/form-register/form-register.component';
import { RegisterPatientComponent } from './components/patient/register-patient/register-patient.component';
import { patientGuard } from './services/patient-service/patient.guard';
import { PatientDashboardComponent } from './components/patient/patient-dashboard/patient-dashboard.component';
import { ProfilePatientComponent } from './components/patient/profile-patient/profile-patient.component';
import { ListDoctorsComponent } from './components/doctor/list-doctors/list-doctors.component';
import { AboutusComponent } from './components/aboutus/aboutus.component';
import { DetailsMessageComponent } from './components/doctor/messages/details-message/details-message.component';

const routes: Routes = [
  {path: "", component: InicioComponent, pathMatch:"full"},
  {path: "register-doctor", component: RegisterComponent},
  {path: "login", component: LoginComponent},
  {path: "dashboard/:id", component: DashBoardComponent, canActivate: [doctorGuard]},
  {path: "dashboard-patient/:id", component: PatientDashboardComponent, canActivate: [patientGuard]},
  {path: "doctors-details-doctor/:id/:string/:string", component: DoctorsDetailsComponent},
  {path: "profile-doctor", component: ProfileDoctorComponent, canActivate: [doctorGuard]},
  {path: "profile-patient", component: ProfilePatientComponent, canActivate: [patientGuard]},
  {path: "messages", component: MessagesComponent, canActivate: [doctorGuard]},
  {path: "details-message/:id", component: DetailsMessageComponent, canActivate: [doctorGuard]},
  {path: "form-register", component: FormRegisterComponent},
  {path: "register-patient", component: RegisterPatientComponent},
  {path: "doctors", component: ListDoctorsComponent},
  {path: "about-us", component: AboutusComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
