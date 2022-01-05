import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule, getLocaleMonthNames } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { FuseSharedModule } from '@fuse/shared.module';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatRippleModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ChartsModule } from 'ng2-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';
import { NgxCurrencyModule } from "ngx-currency";
import { NgxMaskModule } from 'ngx-mask'
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import * as moment from 'moment';
import { ConstantsService } from '../app/services/constants.service';
import { AutoInputFocusDirective } from './directives/auto-input-focus.directive';
import { ProgressComponent } from './controls/progress/progress.component';

//Set moment locale
moment.locale('pt-BR');

//Serviços
import { DialogService } from 'app/services/dialog.service';

//Controles
import { AdicionaCustoAvulsoComponent } from 'app/controls/adiciona-custo-avulso/adiciona-custo-avulso.component';
import { AdicionaCustoComponent } from 'app/controls/adiciona-custo/adiciona-custo.component';
import { GeraFaturaAvulsaComponent } from 'app/controls/gera-fatura-avulsa/gera-fatura-avulsa.component';
import { AdicionaCustoCombustivelComponent } from 'app/controls/adiciona-custo-combustivel/adiciona-custo-combustivel.component';
import { MultiSelectComponent } from 'app/controls/multi-select/multi-select.component';
import { GeraSegundaViaFaturaComponent } from 'app/controls/gera-segunda-via-fatura/gera-segunda-via-fatura.component';
import { ControlesTituloPaginaComponent } from 'app/controls/titulo-pagina/titulo-pagina.component';
import { ControlesBuscaRapidaComponent } from 'app/controls/busca-rapida/busca-rapida.component';
import { ControlesLegendaComponent } from 'app/controls/legenda/legenda.component';
import { VisualizaParcelaComponent } from 'app/controls/visualiza-parcela/visualiza-parcela.component';

export const datePickerConfig = {
    separator: ' à ',
    applyLabel: 'OK',
    daysOfWeek: moment.weekdaysMin(),
    monthNames: moment.monthsShort(),
    firstDay: moment.localeData().firstDayOfWeek(),
    //format: 'YYYY-MM-DD', // could be 'YYYY-MM-DDTHH:mm:ss.SSSSZ'
    displayFormat: 'DD/MM/YYYY', // default is format value
    direction: 'ltr', // could be rtl
    weekLabel: 'Semana',
    cancelLabel: 'Cancelar', // detault is 'Cancel'            
    clearLabel: 'Limpar', // detault is 'Clear'
    customRangeLabel: 'Períodos',
};

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatProgressSpinnerModule,
        MatAutocompleteModule,
        HttpClientModule,
        MatDialogModule,
        MatCardModule,
        MatStepperModule,
        MatTabsModule,
        MatTableModule,
        FuseSharedModule,
        MatButtonModule,
        MatChipsModule,
        MatRippleModule,
        MatExpansionModule,
        MatTooltipModule,
        MatMenuModule,
        MatSelectModule,
        MatCheckboxModule,
        MatRadioModule,
        MatGridListModule,
        MatPaginatorModule,
        MatSnackBarModule,
        MatSortModule,
        MatDatepickerModule,
        ChartsModule,
        NgxChartsModule,
        FuseWidgetModule,
        NgxDaterangepickerMd.forRoot(datePickerConfig),
        NgxMaskModule.forRoot(),
        NgxCurrencyModule
    ],
    declarations: [
        ControlesTituloPaginaComponent,
        ControlesBuscaRapidaComponent,
        ControlesLegendaComponent,
        AutoInputFocusDirective,
        AdicionaCustoAvulsoComponent,
        AdicionaCustoComponent,
        ProgressComponent,
        GeraFaturaAvulsaComponent,
        AdicionaCustoCombustivelComponent,
        MultiSelectComponent,
        GeraSegundaViaFaturaComponent,
        VisualizaParcelaComponent,
    ],
    exports: [
        CommonModule,
        ControlesTituloPaginaComponent,
        ControlesBuscaRapidaComponent,
        ControlesLegendaComponent,
        MatDatepickerModule,
        NgxMaskModule,
        NgxCurrencyModule,
        NgxDaterangepickerMd,
        AutoInputFocusDirective,
        AdicionaCustoAvulsoComponent,
        AdicionaCustoComponent,
        ProgressComponent,
        GeraFaturaAvulsaComponent,
        AdicionaCustoCombustivelComponent,
        MultiSelectComponent,
        GeraSegundaViaFaturaComponent,
        VisualizaParcelaComponent,
    ],
    providers: [DialogService, ConstantsService]
})

export class SharedModule {
}