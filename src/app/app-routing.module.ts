import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { EditableComponent } from './components/editable/editable.component';


const routes: Routes = [{
  path: '',
  component: HomeComponent
}, {
  path: 'editable',
  component: EditableComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
