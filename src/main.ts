/// <reference types="@angular/localize" />

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import {bootstrapApplication} from "@angular/platform-browser";

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
