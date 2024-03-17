import { Message } from "./message";
import { Role } from "./role";
import { Specialty } from "./specialty";

export class User{
    id:number;
    firstname:string;
    lastname:string;
    email:string;
    password:string;
    phone:string;
    photo:string;
    sex:string;
    specialty:string;
    roles:Role[] = [];
    messages: Message[] = [];
}