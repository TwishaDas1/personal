import { Component, OnInit, Inject  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';
import { StudyDetails } from '../_models/index';
import { map } from 'rxjs/operators/map';
import { EditService } from '../_services/index';
import { AlertService } from '../_services/index';

@Component({
  selector: 'app-search-module',
  templateUrl: './search-module.component.html',
  styleUrls: ['./search-module.component.css']
})
export class SearchModuleComponent implements OnInit {
    public view: Observable<GridDataResult>;
    public gridState: State = {
        sort: [],
        skip: 0,
        take: 10
    };

    public formGroup: FormGroup;
    public editDataItem: StudyDetails;
    public isNew: boolean;
    public searchStudy: any = {};
    private editService: EditService;
    paramId: string;
    constructor(private route: ActivatedRoute, @Inject(EditService) editServiceFactory: any) {
        this.editService = editServiceFactory();
    }

    public ngOnInit(): void {
        this.getModule();
        this.view = this.editService.pipe(map(data => process(data, this.gridState)));
        //this.editService.read();
    }

    public getModule(): void {
      this.paramId = this.route.snapshot.paramMap.get('id');
    }

    public fetch(searchStudy): void {
      this.editService.read(searchStudy);
    }

    public clear() {
       this.searchStudy = {};
       this.editService.read("clear");
    }
    public onStateChange(searchStudy,state: State) {
        this.gridState = state;
        this.editService.read(searchStudy);
    }

    public addHandler() {
        this.editDataItem = new StudyDetails();
        this.isNew = true;
    }

    public editHandler({dataItem}, searchStudy) {
        this.editDataItem = dataItem;
        this.isNew = false;
    }

    public cancelHandler() {
        this.editDataItem = undefined;
    }

    public saveHandler(studyDetails: StudyDetails) {
        this.editService.save(studyDetails, this.searchStudy, this.isNew);
        this.editDataItem = undefined;
    }

    public removeHandler({dataItem}) {
        this.editService.remove(dataItem, this.searchStudy);
    }
}
