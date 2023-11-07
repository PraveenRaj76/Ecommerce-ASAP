import { Component, OnInit } from '@angular/core';
import {NgForm} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  // @ts-ignore
  loginMessage: string;
  // @ts-ignore
  emailorusername: string;
  // @ts-ignore
  password: string;
  // @ts-ignore
  fieldTextType: boolean;
  private emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
  private usernamePattern = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$/;

  constructor(private router: Router,
              private authService: AuthService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.authService.authState$.subscribe(authState => {
      if(authState) {
        this.router.navigateByUrl(this.route.snapshot.queryParams['returnUrl'] || '');
      } else {
        this.router.navigateByUrl('/login');
      }
    })
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  login(form: NgForm) {
    const value = this.emailorusername;
    const password = this.password;

    if(form.invalid) {
      return;
    }

    form.reset();

    if(value.match(this.emailPattern)) {
      const email = value;
      this.authService.loginUsingEmail(email, password);
    } else {
      const username = value;
      this.authService.loginUsingUsername(username, password);
    }

    this.authService.loginMessage$.subscribe(msg => {
      this.loginMessage = msg;
      setTimeout(() => {
        this.loginMessage = '';
      }, 5000);
    });

  }
}
