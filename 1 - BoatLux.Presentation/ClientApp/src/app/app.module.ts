import { RouteProtectionService } from 'app/services/route-protection.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { MatMomentDateModule, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { JwtModule } from "@auth0/angular-jwt";
//import 'hammerjs';                         
import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';
import { fuseConfig } from 'app/fuse-config';
import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';
//import { InicioModule } from 'app/main/modulos/inicio/inicio.module';
//import { ComprasModule } from 'app/main/modulos/compras/compras.module';
//import { CadastrosModulo } from 'app/main/modulos/cadastros/cadastros.module';
import { NotFoundComponent } from 'app/single-pages/not-found/not-found.component';
import { LocalStorageService } from 'app/services/local-storage.service';
import { EndpointService } from './services/endpoint.service';
import { WINDOW_PROVIDERS } from './providers/window.provider';
import { DateAdapter, MatNativeDateModule, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { UtilsService } from './services/utils.service';
import { AccessDeniedComponent } from 'app/single-pages/access-denied/access-denied.component';
import { DndDirective } from './directives/dnd.directive';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const appRoutes: Routes = [
    {
        path: 'pages',
        loadChildren: 'app/single-pages/single-pages.module#SinglePagesModule'
    },
    {
        path: '',
        pathMatch: 'full',
        loadChildren: () => import('app/modules/inicio/inicio.module').then(m => m.InicioModule) //Lazyload
    },
    {
        path: 'inicio',
        loadChildren: () => import('app/modules/inicio/inicio.module').then(m => m.InicioModule) //Lazyload
    },
    {
        path: 'financeiro',
        loadChildren: () => import('app/modules/financeiro/financeiro.module').then(m => m.FinanceiroModule)
    },
    { path: 'access-denied', component: AccessDeniedComponent, canActivate: [RouteProtectionService] },
    { path: 'recurso-em-construcao', component: NotFoundComponent, canActivate: [RouteProtectionService] },
    { path: '**', redirectTo: '/recurso-em-construcao' },
    { path: 'access-denied', redirectTo: '/access-denied' },
];

export function tokenGetter() {

    let localStorageService = new LocalStorageService();
    return localStorageService.get("loginData").token;
}

export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;

@NgModule({
    declarations: [
        AppComponent,
        NotFoundComponent,
        AccessDeniedComponent,
        DndDirective
    ],
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes),
        TranslateModule.forRoot(),
        // Material moment date module
        MatMomentDateModule,
        // Material
        MatButtonModule,
        MatIconModule,
        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,
        // App modules
        LayoutModule,
        JwtModule.forRoot({
            config: {
                tokenGetter: tokenGetter,
                whitelistedDomains: [],
                blacklistedRoutes: []
            }
        }),
        NgxMaskModule.forRoot(),
        MatNativeDateModule,
        ReactiveFormsModule,
        FormsModule
    ],
    providers: [
        {
            provide: MAT_DATE_LOCALE,
            useValue: 'pt-BR'
        },
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
        },
        {
            provide: MAT_DATE_FORMATS,
            useValue: MAT_MOMENT_DATE_FORMATS
        },
        LocalStorageService,
        RouteProtectionService,
        WINDOW_PROVIDERS,
        EndpointService,
        UtilsService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor(dateAdapter: DateAdapter<any>) {
        //Define a cultura padrão do Angular Material
        dateAdapter.setLocale('pt-BR');
    }
}