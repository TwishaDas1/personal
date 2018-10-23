import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Headers, RequestOptions } from '@angular/http';

import { tap } from 'rxjs/operators/tap';
import { map } from 'rxjs/operators/map';

const CREATE_ACTION = 'create';
const UPDATE_ACTION = 'update';
const REMOVE_ACTION = 'destroy';

@Injectable()
export class EditService extends BehaviorSubject<any[]> {
    constructor(private http: HttpClient) {
        super([]);
    }

    private data: any[] = [];
    public searchStudy: any = {};
    private res: any[] = [];

    public read(searchStudy) {
        /*if (this.data.length) {
            return super.next(this.data);
        }*/
        this.fetch(searchStudy)
            .pipe(
                tap(data => {
                    this.data = data;
                })
            )
            .subscribe(data => {
                super.next(data);
            });
    }

    public save(data: any, searchStudy, isNew?: boolean ) {
        const action = isNew ? CREATE_ACTION : UPDATE_ACTION;
        this.reset();
        this.validateStudyDetails(data)
        this.fetch(data, action)
          .subscribe(() => this.read(searchStudy), () => this.read(searchStudy));
    }

    public validateStudyDetails(data: any): Observable<any[]>{
      return this.http.get<any[]>(`http://localhost:3000/StudyDetails?studyID=${data.studyID}`)
      .map(res => this.res = res);
    }

    public remove(data: any, searchStudy) {
        this.reset();
        this.fetch(data, REMOVE_ACTION)
            .subscribe(() => this.read(searchStudy), () => this.read(searchStudy));
    }

    public resetItem(dataItem: any) {
        if (!dataItem) { return; }

        // find orignal data item
        const originalDataItem = this.data.find(item => item.ProductID === dataItem.ProductID);

        // revert changes
        Object.assign(originalDataItem, dataItem);
        super.next(this.data);
    }

    private reset() {
        this.data = [];
    }

    private fetch(searchStudy,action: string = '', data?: any): Observable<any> {
      if(action == 'create') {
        const searchUrl = 'http://localhost:3000/StudyDetails';
        let url = `${searchUrl}`;
        let headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
          return this.http.post(url, searchStudy, {headers: headers});

      } else if(action == 'update') {
        const searchUrl = 'http://localhost:3000/StudyDetails';
        let url = `${searchUrl}/${searchStudy.id}`;
        let body = JSON.stringify(searchStudy);
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
          return this.http.put(url, searchStudy, {headers: headers});

      } else if(action == 'destroy') {
        const searchUrl = 'http://localhost:3000/StudyDetails';
        let url = `${searchUrl}/${searchStudy.id}`;
        let body = JSON.stringify(searchStudy);
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
          return this.http.delete(url, searchStudy);

      } else if(searchStudy != undefined && searchStudy != "clear") {
        return this.http.get<any[]>(`http://localhost:3000/StudyDetails`, { params: searchStudy })
            .pipe(map(res => <any[]>res));
      } else if(searchStudy == "clear") {
        return this.http.get<any[]>(`http://localhost:3000/StudyDetails?studyID='null'`)
            .pipe(map(res => <any[]>res));
      }
    }

}
