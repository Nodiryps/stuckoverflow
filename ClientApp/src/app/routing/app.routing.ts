import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from '../components/home/home.component';
import { CounterComponent } from '../components/counter/counter.component';
import { FetchDataComponent } from '../components/fetch-data/fetch-data.component';
import { UserListComponent } from '../components/userList/userList.component';

const appRoutes: Routes = [
    {path: '',           component: HomeComponent, pathMatch: 'full'},
    {path: 'counter',    component: CounterComponent},
    {path: 'fetch-data', component: FetchDataComponent},
    {path: 'users',      component: UserListComponent},
    {path: '**',         redirectTo: ''}
];

export const AppRoutes = RouterModule.forRoot(appRoutes);