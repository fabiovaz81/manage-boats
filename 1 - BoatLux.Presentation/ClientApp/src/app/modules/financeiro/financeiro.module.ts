//Módulos
import { RouteProtectionService } from '../../services/route-protection.service';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatRippleModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ChartsModule } from 'ng2-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';
import { LocalStorageService } from '././../../services/local-storage.service';
import { NgxCurrencyModule } from "ngx-currency";
import { NgxMaskModule, IConfig } from 'ngx-mask'
import { SharedModule } from '../../shared.module';
import { NgxDropzoneModule } from 'ngx-dropzone';

//Páginas

import { FinanceiroDashboardComponent } from './dashboard/dashboard.component';
import { FinanceiroDashboardService } from './dashboard/dashboard.service';
import { CustosComponent } from './cadastros/custos/custos.component';
import { CentroCustosComponent } from './processos/centro-custos/centro-custos.component';
import { PrestadoresComponent } from './cadastros/prestadores/prestadores.component';
import { AcompanhamentoFaturasComponent } from './processos/acompanhamento-faturas/acompanhamento-faturas.component';

// Dialogs
import { CadastroCustos_DialogComponent } from './cadastros/custos/cadastro-custos-dialog/cadastro-custos-dialog.component';
import { FaturaEmbarcacao_DialogComponent } from './processos/centro-custos/fatura-embarcacao-dialog/fatura-embarcacao-dialog.component';
import { CadastroPrestador_DialogComponent } from './cadastros/prestadores/cadastro-prestador-dialog/cadastro-prestador-dialog.component';
import { VisualizaFaturaDialogComponent } from './processos/acompanhamento-faturas/visualiza-fatura/visualiza-fatura.component';
import { CancelaFaturaDialogComponent } from './processos/acompanhamento-faturas/cancela-fatura/cancela-fatura.component';

const routes = [
    {
        path: 'dashboard',
        component: FinanceiroDashboardComponent,
        canActivate: [RouteProtectionService]
    },
    {
        path: 'cadastros/custos',
        component: CustosComponent,
        canActivate: [RouteProtectionService]
    },
    {
        path: 'cadastros/prestadores',
        component: PrestadoresComponent,
        canActivate: [RouteProtectionService]
    },
    {
        path: 'processos/centro-custos',
        component: CentroCustosComponent,
        canActivate: [RouteProtectionService]
    },
    {
        path: 'processos/acompanhamento-faturas',
        component: AcompanhamentoFaturasComponent,
        canActivate: [RouteProtectionService]
    }
];

//export let options: Partial<IConfig> | (() => Partial<IConfig>);

@NgModule({
    declarations: [
        FinanceiroDashboardComponent,
        CustosComponent,
        CadastroCustos_DialogComponent,
        CentroCustosComponent,
        FaturaEmbarcacao_DialogComponent,
        PrestadoresComponent,
        CadastroPrestador_DialogComponent,
        AcompanhamentoFaturasComponent,
        VisualizaFaturaDialogComponent,
        CancelaFaturaDialogComponent,
    ],
    imports: [
        RouterModule.forChild(routes),
        NgxMaskModule.forRoot(),
        NgxCurrencyModule,
        TranslateModule,
        FuseSharedModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatFormFieldModule,
        MatIconModule,
        MatMenuModule,
        MatSelectModule,
        MatTabsModule,
        MatTableModule,
        MatPaginatorModule,
        MatChipsModule,
        MatRippleModule,
        MatSnackBarModule,
        MatSortModule,
        MatInputModule,
        MatStepperModule,
        MatProgressSpinnerModule,
        MatAutocompleteModule,
        MatDatepickerModule,
        MatExpansionModule,
        HttpClientModule,
        MatCheckboxModule,
        MatRadioModule,
        MatCardModule,
        MatGridListModule,
        MatDialogModule,
        MatTooltipModule,
        SharedModule,
        ChartsModule,
        NgxChartsModule,
        NgxDropzoneModule,
        FuseWidgetModule

    ],
    exports: [
        RouterModule,
        FinanceiroDashboardComponent,
        CustosComponent,
        CentroCustosComponent,
        PrestadoresComponent,
        AcompanhamentoFaturasComponent,
    ],
    providers: [RouteProtectionService, FinanceiroDashboardService, LocalStorageService]
})

export class FinanceiroModule {
    public constructor(private titleService: Title) {
        console.log("Start Financeiro.");
    }
}