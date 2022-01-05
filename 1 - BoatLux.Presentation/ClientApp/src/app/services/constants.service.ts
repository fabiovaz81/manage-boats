import { CurrencyMaskInputMode } from 'ngx-currency';
import { Injectable } from '@angular/core';

@Injectable()
export class ConstantsService { 
}

export const DATE_PICKER_MONTH_YEAR = {
    parse: {
        dateInput: 'MM/YYYY',
    },
    display: {
        dateInput: 'MM/YYYY',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};
