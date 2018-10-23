import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent }   from './login/login.component';
import { SearchModuleComponent } from './search-module/search-module.component';
import { StudyInfoComponent } from './study-info/study-info.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', component: LoginComponent } ,
  { path: 'home', component: HomeComponent },
  { path: 'searchModule/:id', component: SearchModuleComponent },
  { path: 'businessRuleConfig', component: StudyInfoComponent}
  ];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [ RouterModule ],
  declarations: []
})
export class AppRoutingModule { }
