import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FaqComponent } from './body/faq/faq.component';
import { HomeComponent } from './body/home/home.component';

const routes: Routes = [
    {
        path: 'faq',
        component: FaqComponent
    },
    // {
    //     path: 'register',
    //     component: RegisterComponent
    // },
    // {
    //     path: 'volunteer',
    //     component: VolunteerComponent
    // },
    {
        path: '',
        component: HomeComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HomePageRoutingModule { }
