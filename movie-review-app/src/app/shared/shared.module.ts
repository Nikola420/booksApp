import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieComponent } from './movie/movie.component';

@NgModule({
  declarations: [
    MovieComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    MovieComponent
  ]
})
export class SharedModule { }
