<template>
    <div class="columns is-multiline"
        v-if="logs.length > 0">
        <div class="column is-one-third-widescreen is-half-desktop is-full-tablet"
            v-for="(log, index) in logs"
            :key="index">
            <card class="is-rounded raises-on-hover"
                collapsible
                :loading="loading">
                <card-header class="has-background-light">
                    <span class="icon is small">
                        <fa :icon="icon"/>
                    </span>
                    <template #title>
                        {{ log.name }}
                    </template>
                    <template #controls>
                        <card-control
                            v-if="log.visible">
                            <span class="icon is-small is-naked"
                                @click="$router.push({
                                    name: 'system.logs.show',
                                    params: { log: log.name }
                                }).catch(routerErrorHandler)">
                                <fa icon="eye"/>
                            </span>
                        </card-control>
                        <card-control>
                            <a class="icon is-small is-naked"
                                :href="route('system.logs.download', log.name)">
                                <fa icon="cloud-download-alt"/>
                            </a>
                        </card-control>
                        <card-control>
                            <confirmation placement="bottom"
                                @confirm="empty(log)">
                                <span class="icon is-small is-naked">
                                    <fa icon="trash-alt"/>
                                </span>
                            </confirmation>
                        </card-control>
                        <card-refresh @refresh="fetch"/>
                        <card-collapse/>
                    </template>
                </card-header>
                <card-content class="p-3">
                    <p>
                        <span>{{ i18n("Last updated") }}</span>
                        <span class="is-pulled-right">
                            {{ timeFromNow(log.modified) }}
                        </span>
                    </p>
                    <p>
                        <span>{{ i18n("Size") }}</span>
                        <span class="is-pulled-right">
                            {{ log.size }} {{ i18n("MB") }}
                        </span>
                    </p>
                </card-content>
            </card>
        </div>
    </div>
    <p class="subtitle is-4 has-text-centered mt-3"
        v-else>
        {{ i18n('No log files available') }}
    </p>
</template>

<script>
import { FontAwesomeIcon as Fa } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faTerminal, faEye, faCloudDownloadAlt, faTrashAlt, faSyncAlt,
} from '@fortawesome/free-solid-svg-icons';
import {
    Card, CardHeader, CardContent, CardControl, CardRefresh, CardCollapse,
} from '@liberu-ui/card/bulma';
import Confirmation from '@liberu-ui/confirmation/bulma';
import formatDistance from '@liberu-ui/ui/src/modules/plugins/date-fns/formatDistance';

library.add(faTerminal, faEye, faCloudDownloadAlt, faTrashAlt, faSyncAlt);

export default {
    name: 'Index',

    components: {
        Card,
        CardHeader,
        CardContent,
        CardControl,
        CardRefresh,
        CardCollapse,
        Confirmation,
        Fa,
    },

    inject: [
        'errorHandler', 'http', 'i18n', 'route', 'routerErrorHandler', 'toastr',
    ],

    data: () => ({
        logs: [],
        loading: false,
    }),

    computed: {
        icon() {
            return faTerminal;
        },
    },

    created() {
        this.fetch();
    },

    methods: {
        fetch() {
            this.loading = true;
            this.http.get(this.route('system.logs.index'))
                .then(({ data }) => {
                    this.logs = data;
                    this.loading = false;
                }).catch(this.errorHandler);
        },
        empty(log) {
            this.http.delete(this.route('system.logs.destroy', log.name))
                .then(({ data }) => {
                    const index = this.logs.findIndex(item => log.name === item.name);
                    this.logs.splice(index, 1, data.log);
                    this.toastr.success(data.message);
                }).catch(this.errorHandler);
        },
        timeFromNow(date) {
            return formatDistance(date);
        },
    },
};
</script>
