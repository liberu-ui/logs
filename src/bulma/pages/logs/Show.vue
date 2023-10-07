<template>
    <card class="is-rounded raises-on-hover"
        v-if="log">
        <card-header class="has-background-light">
            <template #title>
                <p>
                    {{ i18n('The log file') }}
                    <code>{{ log.name }}</code>
                    {{ i18n('was last updated') }}
                    {{ log.modified ? timeFromNow(log.modified) : null }}
                    {{ i18n('ago') }}.
                    {{ i18n('Current file size is') }} {{ log.size }} {{ i18n('MB') }}
                </p>
            </template>
            <template #controls>
                <card-control>
                    <a class="icon is-small has-text-info"
                        :href="route('system.logs.download', log.name)">
                        <fa icon="cloud-download-alt"/>
                    </a>
                </card-control>
                <card-control>
                    <confirmation placement="bottom"
                        @confirm="empty(log)">
                        <span class="icon is-small has-text-danger">
                            <fa icon="trash-alt"/>
                        </span>
                    </confirmation>
                </card-control>
                <card-refresh @refresh="fetch()"/>
            </template>
        </card-header>
        <card-content class="is-paddingless"
            :key="log.modified">
            <pre class="log"
                v-hljs>
                <code class="php">
{{ log.content || i18n('The log file is empty') }}
                </code>
            </pre>
        </card-content>
    </card>
</template>

<script>
import { FontAwesomeIcon as Fa } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCloudDownloadAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import {
    Card, CardHeader, CardRefresh, CardControl, CardContent,
} from '@liberu-ui/card/bulma';
import Confirmation from '@liberu-ui/confirmation/bulma';
import { hljs } from '@liberu-ui/directives';
import formatDistance from '@liberu-ui/ui/src/modules/plugins/date-fns/formatDistance';

library.add(faCloudDownloadAlt, faTrashAlt);

export default {
    name: 'Show',

    directives: { hljs },

    components: {
        Card,
        CardHeader,
        CardRefresh,
        CardControl,
        CardContent,
        Confirmation,
        Fa,
    },

    inject: ['errorHandler', 'http', 'i18n', 'route', 'toastr'],

    data: () => ({
        log: null,
        content: null,
    }),

    created() {
        this.fetch();
    },

    methods: {
        fetch() {
            this.http.get(this.route('system.logs.show', this.$route.params.log))
                .then(({ data }) => {
                    this.log = data;
                }).catch(this.errorHandler);
        },
        empty() {
            this.http.delete(this.route('system.logs.destroy', this.log.name)).then(({ data }) => {
                this.log = data.log;
                this.toastr.success(data.message);
            }).catch(this.errorHandler);
        },
        timeFromNow(date) {
            return formatDistance(date);
        },
    },
};
</script>

<style src="highlight.ts/styles/atom-one-light.css"></style>

<style lang="scss">
    pre.log {
        background-color: unset;
        padding: 0;
    }
</style>
