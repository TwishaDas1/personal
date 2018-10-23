import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http, Headers, Response } from '@angular/http';
import { AlertService, AuthenticationService } from '../_services/index';
import { User } from '../_models/index';
import { UserService } from '../_services/index';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  model: any = {};
  loading = false;
  returnUrl: string;
  currentUser: User;

  constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService,
        private http: Http,
        private userService: UserService
        ) { }

  ngOnInit() {
        // reset login status
        this.authenticationService.logout();

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
    }
    login() {
             this.loading = true;
                 return this.http.get(`http://localhost:3000/Student?login.username=${this.model.username}&login.password=${this.model.password}`)
              .subscribe(
                  data => {
                  let user = data.json();
                    if(user.length ) {
                      this.userService.setUser('currentUser', JSON.stringify(user));
                      this.router.navigate([this.returnUrl]);
                    } else {
                      this.alertService.error("Username or Password is Invalid");
                      this.loading = false;
                    }
              });

        }
}
