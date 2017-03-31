<template>
    <section class="col-xs-12 section-container">

        <div class="modal-mpf-content-data simple-text-config admin-library-form">
            <h1>{{ library.name }}</h1>

            <vf-form action="process-form" method="POST" :validation="validation" :options="options">

                <!-- Input Name -->
                <div class="modal-mpf-row">
                    <vf-text label="Name:" name="name" value="library.name || ''" placeholder="Enter name here." required></vf-text>
                </div>

                <!-- Input Description -->
                <div class="modal-mpf-row">
                    <vf-text label="Description:" name="description" value="library.description || ''" placeholder="Enter description here." required></vf-text>
                </div>

                <!-- Select modules -->
                <div class="modal-mpf-row selector">
                    <div id="modules-container">
                        <div v-if="library.modules">
                            <div v-for="(module, group) in library.modules" :id="'modules-' + group">
                                <div :id="'group-container-' + group">
                                    <vf-select label="group == 'default' ? 'Ungrouped Modules' : 'Module Group: ' + group" multiple="true" :name="'modules-' + group" container-class="form-control selectpicker" options="modules" required></vf-select>

                                    <div v-if="group == 'default'" class="sep">
                                        <br /><br />
                                    </div>
                                    <div v-else>
                                        <span class="glyphicon glyphicon-remove group-remove" :data-module-container="'modules-' + group"></span><hr />
                                    </div>
                                    ?>
                                </div>
                            </div>
                        </div>

                        <div v-else>
                            <vf-select label="Ungrouped Modules" multiple="true" name="modules-default" container-class="form-control selectpicker" options="modules" required></vf-select>
                            <br /><hr />
                        </div>
                    </div>

                    <button class="btn btn-success pull-right btn-add-group" @click="addGroup">Add Group</button>
                </div>

                <!-- Input config -->
                <div class="modal-mpf-row">
                    <vf-textarea label="Config" name="library-config" lazy="true" value="library.config" placeholder="Enter config here." required></vf-textarea>
                </div>

                <!-- Input submit  -->
                <div class="modal-mpf-submit">
                    <vf-submit text="Submit" container-class="btn btn-success pull-right submit-config"></vf-submit>
                </div>
            </vf-form>
        </div>
    </section>

</template>

<script>
    import libraryService from '../../services/library'

    export default {
        name: 'Library',
        props: ['library'],
        components: {

        },
        data: function() {
            return {

            }
        },
        methods: {
            loadLibrary() {
                let libraryId = this.$route.params.id;

                return libraryService.getLibrary(libraryId)
                    .then( function (response) {
                        this.library = response;
                    })
                    .catch( function (error) {
                        this.$root.$toast('Got nothing from server. Prompt user to check internet connection and try again', {className: 'et-warn'});
                    });
            }
        },
        created: function () {
            console.log(this);
        }
    };
</script>