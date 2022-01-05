import { FuseNavigation } from '@fuse/types';

export const financeiro_navigation: FuseNavigation[] = [
    {
        id: 'modulo_financeiro',
        title: 'Financeiro',
        type: 'group',
        //icon: 'arrow_forward_ios',
        children: [
            {
                id: 'menu',
                title: 'Dashboard',
                type: 'item',
                icon: 'dashboard',
                url: '/financeiro/dashboard',
            },
        ]
    },
    {
        id: 'cadastros',
        title: 'Cadastros',
        type: 'group',
        children: [
            {
                id: 'custos',
                title: 'Custos',
                type: 'item',
                icon: 'account_balance',
                url: '/financeiro/cadastros/custos',
            },
            {
                id: 'prestadores',
                title: 'Prestadores',
                type: 'item',
                icon: 'business_center',
                url: '/financeiro/cadastros/prestadores',
            },
        ]
    },
    {
        id: 'processos',
        title: 'Processos',
        type: 'group',
        children: [
            {
                id: 'centrodecustos',
                title: 'Centro de Custos',
                type: 'item',
                icon: 'pie_chart',
                url: '/financeiro/processos/centro-custos',
                badge: {
                    title: 'dev',
                    bg: 'green',
                    fg: '#FFFFFF'
                }
            },
            {
                id: 'aprovacaolancamentos',
                title: 'Aprov. de Lançamentos',
                type: 'item',
                icon: 'fact_check',
                url: '/financeiro/processos/aprovacao-lancamentos',
                badge: {
                    title: 'dev',
                    bg: 'green',
                    fg: '#FFFFFF'
                }
            },
            {
                id: 'acompanhamentoFaturas',
                title: 'Acomp. de Faturas',
                type: 'item',
                icon: 'info',
                url: '/financeiro/processos/acompanhamento-faturas',
                badge: {
                    title: 'dev',
                    bg: 'green',
                    fg: '#FFFFFF'
                }
            },
        ]
    },
    {
        id: 'demonstrativos',
        title: 'Demonstrativos',
        type: 'group',
        children: [
            {
                id: 'extrat',
                title: 'Extrato',
                type: 'item',
                icon: 'trending_up',
                url: '/financeiro/demonstrativos/extrato',
                badge: {
                    title: 'dev',
                    bg: 'green',
                    fg: '#FFFFFF'
                }
            },
        ]
    },
];