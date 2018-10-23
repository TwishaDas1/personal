import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { StudyDetails } from '../_models/index';
import { EditService } from '../_services/index';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Headers, RequestOptions } from '@angular/http';

import { tap } from 'rxjs/operators/tap';
import { map } from 'rxjs/operators/map';

@Component({
  selector: 'kendo-grid-edit-form',
  styles: [
      'style="background-color : black"',
    ],
  templateUrl: './edit-form.component.html'
})
export class EditFormComponent {
    public active = false;
    public opened: boolean = false;
    public errorMsg: string;
    public editForm: FormGroup = new FormGroup({
      'id': new FormControl(),
      'studyID': new FormControl(),
      'title': new FormControl(),
      'phase': new FormControl(),
      'status': new FormControl(),
      'therapeuticArea': new FormControl(),
      'source': new FormControl()
    });

    constructor(private http: HttpClient) {}
    private res: any[] = [];
    @Input() public isNew = false;

    @Input() public set model(studyDetails: StudyDetails) {
        this.editForm.reset(studyDetails);
        this.active = studyDetails !== undefined;
    }

    @Output() cancel: EventEmitter<any> = new EventEmitter();
    @Output() save: EventEmitter<StudyDetails> = new EventEmitter();

    public onSave(e) {
        e.preventDefault();
        let StudyID = this.editForm.value.studyID;
        let Phase = this.editForm.value.phase;
        let Status = this.editForm.value.status;

        if(StudyID == null || StudyID == '') {
          this.opened = true;
          this.errorMsg = "Please enter Study ID";
        } else if(Phase == null || Phase == '') {
          this.opened = true;
          this.errorMsg = "Please select the Phase from the dropdown";
        } else if(Status == null || Status == '') {
          this.opened = true;
          this.errorMsg = "Please select the Status from the dropdown";
        } else {
            //      this.save.emit(this.editForm.value);
            return this.http.get<any[]>(`http://localhost:3000/StudyDetails?studyID=${this.editForm.value.studyID}`)
            .map(res => this.res = res)
            .subscribe( res => {
               let studyDetails = res;
               let studyDetail = studyDetails[0];
               if(this.isNew && studyDetail && studyDetail["studyID"] == this.editForm.value.studyID) {
                this.opened = true;
                this.errorMsg = "StudyID " + this.editForm.value.studyID + " already exist";
               } else {
                 this.save.emit(this.editForm.value);
                 this.active = false;
                 this.errorMsg = '';
               }
            });
        }
    }

    public close() {
      this.opened = false;
    }

    public onCancel(e): void {
        e.preventDefault();
        this.closeForm();
        this.errorMsg = '';
    }

    private closeForm(): void {
        this.active = false;
        this.cancel.emit();
    }
}
