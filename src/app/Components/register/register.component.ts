import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../Services/auth.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit{
  registerFormGroup!: FormGroup;

  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
    this.registerFormGroup = new FormGroup({
      email: new FormControl('', Validators.required),
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      password_conf: new FormControl('', Validators.required),
    })
  }

  onSubmit(): void {
    const values = this.registerFormGroup.value
    if(this.registerFormGroup.status !== "INVALID" && values.password === values.password_conf){
      console.log("registered")
      this.authService.auth({email: values.email, password: values.password}, "signUp", values.username)
    }else{
      console.log("invalid")
    }
  }
}
