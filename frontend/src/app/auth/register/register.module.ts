import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RegisterPage } from './register.page';

@NgModule({
  imports: [
    RouterModule.forChild([{ path: '', component: RegisterPage }])  
  ]
})
export class RegisterPageModule {}
