import routeImporter from '@liberu-ui/ui/src/modules/importers/routeImporter';

const routes = routeImporter(require.context('./logs', false, /.*\.js$/));
const Router = () => import('@liberu-ui/ui/src/bulma/pages/Router.vue');

export default {
    path: 'logs',
    component: Router,
    meta: {
        breadcrumb: 'logs',
        route: 'system.logs.index',
        keepAlive: false,
    },
    children: routes,
};
