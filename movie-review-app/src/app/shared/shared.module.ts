import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';


import { CreateReviewComponent } from './create-review/create-review.component';
import { MovieComponent } from './movie/movie.component';

@NgModule({
  declarations: [
    MovieComponent,
     CreateReviewComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    MovieComponent,
    CreateReviewComponent
  ]
})
export class SharedModule { }
