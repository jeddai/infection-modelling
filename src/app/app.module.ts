import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { HomeComponent } from './components/home/home.component';
import { DecimalPipe, PercentPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditableComponent } from './components/editable/editable.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    EditableComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    DecimalPipe,
    PercentPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
