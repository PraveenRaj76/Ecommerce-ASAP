import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {map} from "rxjs";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registrationForm: FormGroup;
  private namePattern = /^[a-zA-Z][a-zA-Z\s]+$/;
  private emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
  private usernamePattern = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$/;
  private passwordPattern = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/
  // @ts-ignore
  comparePassword: boolean;
  // @ts-ignore
  registrationMessage: string;
  // @ts-ignore
  fieldTextType: boolean;

  constructor(private fb: FormBuilder,
              private authService: AuthService) {

    this.registrationForm = fb.group({
      fname: ['', [Validators.required, Validators.minLength(3), Validators.pattern(this.namePattern)]],
      lname: ['', [Validators.required, Validators.minLength(3), Validators.pattern(this.namePattern)]],
      username: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(25), Validators.pattern(this.usernamePattern)]],
      email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(this.passwordPattern)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
      age: ['', [Validators.required, Validators.minLength(2), Validators.min(18)]]
    });
  }

  get formControls() {
    return this.registrationForm.controls;
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  ngOnInit(): void {
    this.registrationForm.valueChanges
      .pipe(map((controls) => {
        return this.formControls['confirmPassword'].value === this.formControls['password'].value;
      }))
      .subscribe(passwordState => {
        this.comparePassword = passwordState;
      });
  }

  registerUser() {

    if (this.registrationForm.invalid) {
      return;
    }

    this.authService.registerUser({...this.registrationForm.value}).subscribe((response: { message: string }) => {
      this.registrationMessage = response.message;
      setTimeout(() => {
        this.registrationMessage = '';
      }, 5000);
    });

    this.registrationForm.reset();
  }

}
