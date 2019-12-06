import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutes } from '../routing/app.routing';

import { AppComponent } from '../components/app/app.component';
import { JwtInterceptor } from '../interceptors/jwt.interceptor';
import { NavMenuComponent } from '../components/nav-menu/nav-menu.component';
import { HomeComponent } from '../components/home/home.component';
import { LoginComponent } from '../components/login/login.component';
import { CounterComponent } from '../components/counter/counter.component';
import { FetchDataComponent } from '../components/fetch-data/fetch-data.component';
import { UserListComponent } from '../components/userList/userList.component';
import { PostListComponent } from '../components/postList/postList.component';
import { PostDetailComponent } from '../components/postDetail/postDetail.component';
import { UnknownComponent } from '../components/unknown/unknown.component';
import { RestrictedComponent } from '../components/restricted/restricted.component';
import { SignUpComponent } from '../components/signup/signup.component';
import { CreatePostComponent } from '../components/create-post/create-post.component';
import { SharedModule } from './shared.module';
import { EditUserComponent } from '../components/edit-user/edit-user.component';
import { EditPostComponent } from '../components/edit-post/edit-post.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SetFocusDirective } from '../directives/setfocus.directive';


@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    CounterComponent,
    FetchDataComponent,
    LoginComponent,
    UserListComponent,
    PostListComponent,
    PostDetailComponent,
    UnknownComponent,
    RestrictedComponent,
    SetFocusDirective,
    SignUpComponent,
    CreatePostComponent,
    EditUserComponent,
    EditPostComponent
  ],
  entryComponents: [
    EditUserComponent,
    EditPostComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutes,
    BrowserAnimationsModule,
    SharedModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
