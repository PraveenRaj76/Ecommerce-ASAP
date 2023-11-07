import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  contactForm: FormGroup;
  private namePattern = /^[a-zA-Z][a-zA-Z\s]+$/;
  private emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
  // @ts-ignore
  contactMessage: string;

  constructor(private fb: FormBuilder,
              private authService: AuthService) {

    this.contactForm = fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.pattern(this.namePattern)]],
      email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
      message: ['', [Validators.required, Validators.minLength(1)]],
    });
  }

  get formControls() {
    return this.contactForm.controls;
  }


  ngOnInit(): void {
  }

  contactUser() {

    if(this.contactForm.invalid) {
      return;
    }

    this.authService.contactUser({...this.contactForm.value}).subscribe((response: { message: string }) => {
      this.contactMessage = response.message;
      setTimeout(() => {
        this.contactMessage = '';
      }, 5000);
    });
    this.contactForm.reset();
  }
}
