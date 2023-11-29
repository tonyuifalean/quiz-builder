import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  QuizComponent,
  QuizListComponent,
} from './components';
import { AuthGuard } from './helpers';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/quiz-list',
  },
  {
    path: 'quiz-list',
    component: QuizListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'quiz',
    component: QuizComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'quiz/:publicId',
    loadChildren: () =>
      import('./components').then((m) => m.PublicQuizModule),
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./components').then((m) => m.LoginModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
