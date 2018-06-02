import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './pages/home/home-page.component';

const routes: Routes = [
    {
        path: '',
        component: HomePageComponent,
    },
    {
        path: '**',
        redirectTo: '/'
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
export class AppRoutingModule {
}
