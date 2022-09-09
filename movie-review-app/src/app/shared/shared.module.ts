import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieComponent } from './movie/movie.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [
    MovieComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    MovieComponent
  ]
})
export class SharedModule { }
