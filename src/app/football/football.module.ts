import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FootballComponent } from './football.component';
import { FootballRoutingModule } from './football-routing.module';
import { MaterialModule } from '../shared/material.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [FootballComponent],
  imports: [
    CommonModule,
    FormsModule,
    FootballRoutingModule,
    MaterialModule
  ],
  exports: [FootballComponent]
})
export class FootballModule { }
