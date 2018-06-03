import { NgModule } from '@angular/core';
import { LoginPageComponent } from './login-page.component';
import { LoginComponent } from './body/login/login.component';
import { ImportMaterializeModule } from '../../import-materialize.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [
        LoginPageComponent,
        LoginComponent
    ],
    imports: [
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        ImportMaterializeModule
    ],
    entryComponents: [
        LoginPageComponent
    ],
    exports: [
        LoginPageComponent
    ]
})
export class LoginPageModule { }
