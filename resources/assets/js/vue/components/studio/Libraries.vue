<template>
    <section class="col-xs-12 section-container">

        <div class="row">
            <div class="col-xs-12">
                <div class="btn btn-default">
                    <router-link to="/create">Create a new library</router-link>
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
                            <tr v-for="library in libraries.data" :data-library="library._id">
                                <td :title="library.name">{{ library.name }}</td>
                                <td :title="library.description">{{ library.description }}</td>
                                <td title="Modules">
                                    <span v-for="module in library.modules">
                                        {{ module }}
                                    </span>
                                </td>

                                <td>{{ library.created_at }}</td>
                                <td class="text-right actions icons">
                                    <router-link :to="'/' + library._id"><i class="glyphicon glyphicon-pencil"></i></router-link>
                                    <a href="#" class="delete" title="Delete" @click="deleteLibrary(library._id)"><i class="glyphicon glyphicon-ban-circle"></i></a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    </section>



</template>

<script>


    export default {
        name: 'Libraries',
        props: ['libraries'],
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