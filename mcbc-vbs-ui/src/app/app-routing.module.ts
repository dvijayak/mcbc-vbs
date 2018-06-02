import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './pages/home/home-page.component';
import { FaqComponent } from './pages/home/body/faq/faq.component';
import { HomeComponent } from './pages/home/body/home/home.component';

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
            // {
            //     path: 'register',
            //     component: RegisterComponent
            // },
            // {
            //     path: 'volunteer',
            //     component: VolunteerComponent
            // },
        ]
    },
    {
        path: '**',
        redirectTo: ''
    }
    // // 404 not found
    // {
    //     path: '404',
    //     component: NotFoundComponent
    // },
    // {
    //     path: '**',
    //     redirectTo: '/404'
    // },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
