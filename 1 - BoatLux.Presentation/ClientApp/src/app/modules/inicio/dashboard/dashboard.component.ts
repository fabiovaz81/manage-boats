import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { LocalStorageService } from '../../../services/local-storage.service';
import { DashboardService } from './dashboard.service';

const PermissaoAcessar = 'acessar';

@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class DashboardComponent implements OnInit {

    projects: any[];
    selectedProject: any;

    dateNow = Date.now();

    /**
     * Constructor
     *
     * @param {FuseSidebarService} _fuseSidebarService
     */
    constructor(
        private _fuseSidebarService: FuseSidebarService,
        private _dashboardService: DashboardService,
        private _fuseNavigationService: FuseNavigationService,
        private _localStorageService: LocalStorageService,
    ) {
        // Set the main navigation as our current navigation
        this._fuseNavigationService.setCurrentNavigation('inicio_navigation');

        this.projects = [
            {
                'name': 'ACME Corp. Backend App'
            },
            {
                'name': 'ACME Corp. Frontend App'
            },
            {
                'name': 'Creapond'
            },
            {
                'name': 'withinpixels'
            }
        ];

        // TimeOut para carregar os gráficos. Se alterar, verifique se não vai causar erros
        setInterval(() => {
            this.dateNow = Date.now();
        }, 1000);
    }

    loginData() {
        return this._localStorageService.get("loginData");
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle the sidebar
     *
     * @param name
     */
    toggleSidebar(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }
}