import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { User } from '../_models/index';
import * as FileSaver from 'file-saver';
import { RequestMethod, ResponseContentType} from "@angular/http";
import 'rxjs/Rx';
import { Observable, Subject, ReplaySubject, from, of, range } from 'rxjs';
import { map, filter, switchMap } from 'rxjs/operators';

@Injectable()
export class UserService {
    constructor(private http: Http) { }

    getAll() {
        return this.http.get('/api/users', this.jwt()).map((response: Response) => response.json());
    }

    getById(id: number) {
        return this.http.get('/api/users/' + id, this.jwt()).map((response: Response) => response.json());
    }

    create(user: User) {
        return this.http.post('/api/users', user, this.jwt()).map((response: Response) => response.json());
    }

    update(user: User) {
        return this.http.put('/api/users/' + user.id, user, this.jwt()).map((response: Response) => response.json());
    }

    delete(id: number) {
        return this.http.delete('/api/users/' + id, this.jwt()).map((response: Response) => response.json());
    }

    // private helper methods
    getUser(username: string) {
         return this.http.get(`http://localhost:3000/contacts?login.username=${username}`).map((response: Response) => response.json());
    }

    setUser(currentUser: string, user) {
    }

    private jwt() {
        // create authorization header with jwt token
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {
            let headers = new Headers({ 'Authorization': 'Bearer ' + currentUser.token });
            return new RequestOptions({ headers: headers });
        }
    }

    exportFile(data){
      let headers = new Headers({
       'Content-Type': 'application/json',
       'Accept': 'application/pdf',
       'Access-Control-Allow-Origin': "http://localhost:4200",
       'Access-Control-Allow-Methods': 'POST,GET,PUT,DELETE,OPTIONS',
       'Access-Control-Allow-Headers': 'Authorization, Lang',
      });

    }
  }
