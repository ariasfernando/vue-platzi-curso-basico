<template>
    <div>
        <div v-if="slot === 'default'">
            <a class="btn btn-default" :href="editUrl + '?locale=en_us&library=default'">
                Create a new email
            </a>
        </div>

        <div v-if="slot === 'lang'">
            <button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-expanded="false">
                Create a new email<span class="caret"></span>
            </button>
            <ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu1">
                <li v-for="(lang, key) in appConfig.local.langs" role="presentation">
                    <a :href="editUrl + '?locale=' + key + '&library=default'">
                        {{ lang.name }}
                    </a>
                </li>
            </ul>
        </div>

        <div v-if="slot === 'libraries'">
            <div v-if="!userLibraries">
                <a class="btn btn-default" :href="editUrl + '?locale=en_us&library=default'">
                    Create a new email
                </a>
            </div>

            <div v-else>

                <button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-expanded="false">
                    Create a new email<span class="caret"></span>
                </button>
                <ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu1">

                    <li v-for="(libraryValue, libraryKey) in userLibraries">
                        <a :href="editUrl + '?locale=en_us&library=' + libraryValue">
                            {{ libraryValue }}
                        </a>
                    </li>

                </ul>
            </div>
        </div>
    </div>

</template>

<script>
    export default {
        props: ['appSettings', 'userLibraries'],
        data: function() {
            return {
                slot: 'default',
                editUrl: Application.globals.baseUrl + '/campaign/edit'
            }
        },
        methods: {

        },
        created () {
            if ( this.appSettings.view.campaign_format === 'languages' && this.appSettings.locale.langs ) {
                this.slot = 'languages';
            }

            if ( this.appSettings.view.campaign_format === 'libraries' && this.appSettings.view.libraries ) {
                this.slot = 'libraries';
            }
        },
        mounted: function () {

        }
    }
</script>