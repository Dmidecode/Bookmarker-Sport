import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FootballComponent } from './football.component';

const routes: Routes = [
    {
        path: '',
        component: FootballComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FootballRoutingModule {

}