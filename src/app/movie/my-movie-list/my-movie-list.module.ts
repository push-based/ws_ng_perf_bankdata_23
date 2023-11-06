import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { MyMovieListComponent } from './my-movie-list.component';
import {FastSvgModule} from '@push-based/ngx-fast-svg';

const routes: Routes = [
  {
    path: '',
    component: MyMovieListComponent,
  },
];

@NgModule({
    imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FastSvgModule,
    MyMovieListComponent,
],
})
export class MyMovieListModule {}
