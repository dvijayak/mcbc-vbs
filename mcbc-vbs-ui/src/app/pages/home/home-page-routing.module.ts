import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FaqComponent } from './body/faq/faq.component';
import { HomeComponent } from './body/home/home.component';
import { RegisterComponent } from './body/register/register.component';
import { HomePageComponent } from './home-page.component';

const routes: Routes = [
    {
        path: '',
        component: HomePageComponent,
        children: [
            {
                path: '',
                component: HomeComponent
            },
            {
                path: 'faq',
                component: FaqComponent
            },
            {
                path: 'register',
                component: RegisterComponent
            },
            // {
            //     path: 'volunteer',
            //     component: VolunteerComponent
            // },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HomePageRoutingModule { }
