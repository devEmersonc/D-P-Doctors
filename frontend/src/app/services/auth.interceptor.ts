import { HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "./auth-service/auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor{

    constructor(private login: AuthService){}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let authReq = req;
        const token = this.login.getToken();
        if(token != null){
            authReq = authReq.clone({
                setHeaders: {Authorization: `Bearer ${token}`}
            });
        }
        return next.handle(authReq);
    }
}