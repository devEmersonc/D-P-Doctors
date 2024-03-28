import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RegisterComponent } from './components/doctor/register/register.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ContentComponent } from './components/content/content.component';
import { LoginComponent } from './components/login/login.component';
import { AuthInterceptor} from './services/auth.interceptor';
import { InicioComponent } from './components/inicio/inicio.component';
import { BannerComponent } from './components/inicio/banner/banner.component';
import { DoctorsDetailsComponent } from './components/doctor/doctors-details/doctors-details.component';
import { ProfileDoctorComponent } from './components/doctor/profile-doctor/profile-doctor/profile-doctor.component';
import { SidenavComponent } from './components/sidenav/sidenav/sidenav.component';
import { MessagesComponent } from './components/doctor/messages/messages.component';
import { registerLocaleData } from '@angular/common';
import localEs from '@angular/common/locales/es-CL';
import { FormRegisterComponent } from './components/form-register/form-register.component';
import { RegisterPatientComponent } from './components/patient/register-patient/register-patient.component';
import { ProfilePatientComponent } from './components/patient/profile-patient/profile-patient.component';
import { ListDoctorsComponent } from './components/doctor/list-doctors/list-doctors.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FooterComponent } from './components/footer/footer.component';
import { AboutusComponent } from './components/aboutus/aboutus.component';
import { FilterPipe } from './components/pipes/filter.pipe';
import { DetailsMessageComponent } from './components/doctor/messages/details-message/details-message.component';

registerLocaleData(localEs, "es-CL");

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    NavbarComponent,
    ContentComponent,
    LoginComponent,
    ProfileDoctorComponent,
    InicioComponent,
    BannerComponent,
    DoctorsDetailsComponent,
    SidenavComponent,
    MessagesComponent,
    FormRegisterComponent,
    RegisterPatientComponent,
    ProfilePatientComponent,
    ListDoctorsComponent,
    FooterComponent,
    AboutusComponent,
    FilterPipe,
    DetailsMessageComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    
  ],
  providers: [
    {
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptor,
        multi: true,
    },
    {
      provide: LOCALE_ID,
      useValue: 'es-CL'
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
