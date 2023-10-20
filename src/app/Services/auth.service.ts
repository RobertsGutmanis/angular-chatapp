import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Login} from '../Interfaces/login.interface';
import {AuthResponse} from "../Interfaces/auth-response.interface";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router) {
  }

  auth(creds: Login, action: string, username? :string): void {
    this.http.post<AuthResponse>(`https://identitytoolkit.googleapis.com/v1/accounts:${action}?key=AIzaSyBsnHIKuSg7k5-0Y6xRIka1q4q_8Ap7syI`, creds)
      .subscribe({
        next: (response: AuthResponse): void => {
          localStorage.setItem("auth", JSON.stringify({refreshToken: response.refreshToken, localId: response.localId}))
          if(username){
            this.storeUser(response, username)
          }else{
            this.getUser(response.localId)
          }
        },
        error: (error: HttpErrorResponse): void => {
          console.error(error)
        }
      })
  }

  getUser(token: string): void {
    this.http.get(`https://angularcourse-b6e28-default-rtdb.europe-west1.firebasedatabase.app/users.json?orderBy="localId"&equalTo="${token}"`)
      .subscribe({
      next: (value: any): void => {
        for(const key in value){
          localStorage.setItem("user", JSON.stringify({username: value[key].username, email: value[key].email, key: key}))
        }
        this.router.navigate(['/'])
      }
    })
  }

  storeUser(response: AuthResponse, username: string): void{
    this.http.post(`https://angularcourse-b6e28-default-rtdb.europe-west1.firebasedatabase.app/users.json`, {email: response.email, username: username, localId: response.localId})
      .subscribe({
        next: (): void=>{
          this.getUser(response.localId)
        },
        error: (error): void=>{
          alert(`There was an error: ${error}`)
        }
      })
  }
}
