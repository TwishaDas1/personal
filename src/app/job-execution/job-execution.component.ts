import { Component, OnInit, Inject  } from '@angular/core';
import { Params,ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';
import { map } from 'rxjs/operators/map';
import { HttpClient,HttpParams, HttpHeaders } from '@angular/common/http';
import { AlertService, AuthenticationService } from '../_services/index';



@Component({
  selector: 'app-job-execution',
  templateUrl: './job-execution.component.html',
  styleUrls: ['./job-execution.component.css']
})
export class JobExecutionComponent implements OnInit {

  public view: Observable<GridDataResult>;
  data: any[] = [];

  public gridState: State = {
      sort: [],
      skip: 0,
      take: 10
  };

  public formGroup: FormGroup;
  public searchJob: any = {};
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private alertService: AlertService,
  ){ }

  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  selectedItemsList = [];
  loading = false;

  public ngOnInit() {
        this.dropdownList = [
                              {"id":1,"itemName":"Demographics"},
                              {"id":2,"itemName":"Adverse Events"},
                              {"id":3,"itemName":"Concomitant Medications"},
                              {"id":4,"itemName":"Domain1"},
                              {"id":5,"itemName":"Domain2"},
                              {"id":6,"itemName":"Domain3"},
                              {"id":7,"itemName":"Domain4"}
                            ];
      /*  this.selectedItems = [
                              //  {"id":1,"itemName":"Demographics"},
                              //  {"id":3,"itemName":"Concomitant Medications"}

                            ];*/
        this.dropdownSettings = {
                            singleSelection: false,
                            idField: 'id',
                            textField: 'itemName',
                            selectAllText: 'Select All',
                            unSelectAllText: 'Unselect All',
                            itemsShowLimit: 3,
                            maxHeight: 190,//197 is deafult
                            allowSearchFilter: true
                          };
   }
   onItemSelect (item:any) {
    // if(typeof item!= 'undefined' && item!= null && item.length>0){
    console.log(this.item+item+" on select before setting"+this.selectedItemsList);

    this.selectedItemsList.push(item.itemName);

     }
  // }
   //console.log(" on select"+ item.itemName);

   //this.selectedItems = item;


 onSelectAll (items: any) {
   console.log(items);
 }
  public searchJobExecution(searchJob,selectedItems) {
    this.loading = true;

  //  console.log( "selectedItems");
  //  console.log( this.selectedItems);


    console.log( " searchJobExecution selectedItemsList");
    console.log( this.selectedItemsList);

    let params = new HttpParams();
    console.log( "params1");
  //  params = {key: 'domain', array:  this.selectedItemsList};
  
  if(typeof selectedItemsList!= 'undefined' && this.selectedItemsList!= null && this.selectedItemsList.length>0){
   console.log("inside domain looop"+this.selectedItemsList);
    params = params.append('domain',this.selectedItemsList);
    }
    console.log( "params2");
    params = params.append('study', searchJob.study);
    console.log( "params3");
    console.log(params);
    if(searchJob.study) {
      console.log( "params4");
      return this.http.get<any[]>(`http://localhost:3000/JobDetails?`, { params: params })
       .subscribe(data => {this.data = data });
    } else {
      console.log( "params5");
      this.alertService.error("Please choose a study!");
      this.loading = false;
    }

//    this.jobExecutionService.read(searchJob);

  }

  public onStateChange(state: State) {
      this.gridState = state;
  //    this.jobExecutionService.read();
  }

  public reset(searchJob,selectedItems,f): void {
    this.searchJob.domain = "";
    this.searchJob.study = "";
    this.selectedItemsList = [];
    //this.view = '';
    f.form.reset();

  }



}
