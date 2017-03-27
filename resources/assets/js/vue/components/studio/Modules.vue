<template>
    <section class="col-xs-12 section-container">

        <aside id="admin-sidebar" v-if="false">
            Module Settings
        </aside>

        <div class="row">
            <div class="col-xs-12">
                <div class="btn btn-default btn-create">
                    Create a new library
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-xs-12">
                <h2 class="crimson italic">Libraries list</h2>

                <div class="table-responsive">
                    <table width="100%" border="0" cellpadding="0" cellspacing="0" id="admin-library" class="table table-bordered table-striped sortable data-list">
                        <thead>
                            <tr>
                                <th class="sortable">
                                    <a href="#" class="sortable-option sort-order-desc" id="name" data-order-field="name">
                                        Name
                                        <i class="glyphicon glyphicon-triangle-bottom pull-right"></i>
                                    </a>
                                </th>
                                <th class="sortable">
                                    <a href="#" class="sortable-option sort-order-desc" id="email" data-order-field="description">
                                        Description
                                        <i class="glyphicon glyphicon-triangle-bottom pull-right"></i>
                                    </a>
                                </th>
                                <th width="150" class="sortable">
                                    <a href="#" class="sortable-option sort-order-desc" id="created_at" data-order-field="modules">
                                        Modules
                                        <i class="glyphicon glyphicon-triangle-bottom pull-right"></i>
                                    </a>
                                </th>
                                <th width="150" class="sortable">
                                    <a href="#" class="sortable-option sort-order-desc" id="created_at" data-order-field="created_at">
                                        Create Date
                                        <i class="glyphicon glyphicon-triangle-bottom pull-right"></i>
                                    </a>
                                </th>
                                <th  width="150" class="bold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="library in libraries" :data-library="library.id">
                                <td :title="library.name">{{ library }}</td>
                                <td :title="library.description">{{ library.description }}</td>
                                <td title="Modules">

                                </td>

                                <td>{{ library.created_at }}</td>
                                <td class="text-right actions icons">
                                    <a href="#" class="edit" title="Edit" @click="editLibrary(library.id)"><i class="glyphicon glyphicon-pencil"></i></a>
                                    <a href="#" class="delete" title="Delete" @click="deleteLibrary(library.id)"><i class="glyphicon glyphicon-ban-circle"></i></a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <aside id="admin-sidebar" class="right" v-if="false">
            Module Settings
        </aside>
    </section>



</template>

<script>


    export default {
        name: 'Studio',
        props: ['libraries', 'modules'],
        components: {

        },
        data: function() {
            return {

            }
        },
        methods: {

        },
        mounted: function () {
        }
    };
</script>