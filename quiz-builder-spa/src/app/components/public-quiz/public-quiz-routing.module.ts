import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PublicQuizComponent } from './public-quiz.component';

const routes: Routes = [
  {
    path: '',
    component: PublicQuizComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicQuizRoutingModule { }
