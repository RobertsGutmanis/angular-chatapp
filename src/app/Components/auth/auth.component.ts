import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from "../../Services/auth.service";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  loginFormGroup!: FormGroup;
  authError: string = "";

  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
    this.loginFormGroup = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    })
    this.authService.errorSubject.subscribe({
      next: (value: string): void=>{
        this.authError = value
      }
    })
  }

  onSubmit(): void {
    this.authService.auth(this.loginFormGroup.value, "signInWithPassword")
  }
}
