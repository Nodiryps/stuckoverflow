import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from '../components/home/home.component';
import { CounterComponent } from '../components/counter/counter.component';
import { FetchDataComponent } from '../components/fetch-data/fetch-data.component';
import { UserListComponent } from '../components/userList/userList.component';
import { TagListComponent } from '../components/tagList/tagList.component';
import { LoginComponent } from '../components/login/login.component';
import { RestrictedComponent } from '../components/restricted/restricted.component';
import { SignUpComponent } from '../components/signup/signup.component';
import { CreatePostComponent } from '../components/create-post/create-post.component';
import { EditPostComponent } from '../components/edit-post/edit-post.component';
import { PostDetailComponent } from '../components/postDetail/postDetail.component';
import { UnknownComponent } from '../components/unknown/unknown.component';
import { AuthGuard } from '../services/auth.guard';
import { Role } from '../models/user';
import { Post } from '../models/post';

const appRoutes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'counter', component: CounterComponent },
  { path: 'fetch-data', component: FetchDataComponent },
  { path: 'signup', component: SignUpComponent },
  { path: 'create-post', component: CreatePostComponent },
  { path: 'edit-post', component: EditPostComponent },
  {
    path: 'users',
    component: UserListComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin] }
  },
  {
    path: 'tags',
    component: TagListComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin] }
  },
  {
    path: 'postdetail',
    component: PostDetailComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  { path: 'restricted', component: RestrictedComponent },
  { path: '**', component: UnknownComponent }
];

export const AppRoutes = RouterModule.forRoot(appRoutes);