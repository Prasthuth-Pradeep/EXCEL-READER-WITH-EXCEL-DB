import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FileReaderComponent } from './file-reader/file-reader.component';

const routes: Routes = [
  {path: 'reader', component: FileReaderComponent},
  { path: '**', redirectTo: 'reader' },
  { path: '', redirectTo: 'reader', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
