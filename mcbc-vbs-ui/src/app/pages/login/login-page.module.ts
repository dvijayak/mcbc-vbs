import { NgModule } from '@angular/core';
import { LoginPageComponent } from './login-page.component';
import { LoginComponent } from './body/login/login.component';
import { ImportMaterializeModule } from '../../import-materialize.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ServerAuthService } from '../admin/auth/server-auth.service';

@NgModule({
    declarations: [
        LoginPageComponent,
        LoginComponent
    ],
    imports: [
        HttpClientModule,
        FormsModule,
        RouterModule,
        ImportMaterializeModule
    ],
    providers: [
        ServerAuthService
    ],
    exports: [
        LoginPageComponent
    ]
})
export class LoginPageModule { }
