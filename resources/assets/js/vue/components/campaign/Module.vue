<template>
    <table width="100%" cellspacing="0" cellpadding="0">
        <tr v-if="module.columns.length > 1">
            <th class="st-col" v-for="(column, columnId) in module.columns" :width="column.style.default.width" :style="column.style.default">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr v-for="(component, componentId) in column.components">
                        <td>
                            <component :is="component.type" :component="component" :module-id="moduleId" :column-id="columnId" :component-id="componentId"></component>
                        </td>
                    </tr>
                </table>
            </th>
        </tr>
        <tr v-else>
            <td v-for="(column, columnId) in module.columns" :width="column.style.default.width" :style="column.style.default">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr v-for="(component, componentId) in column.components">
                        <td>
                            <component :is="component.type" :component="component" :module-id="moduleId" :column-id="columnId" :component-id="componentId"></component>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</template>

<script>

    import TextElement from './elements/TextElement.vue'
    import ButtonElement from './elements/ButtonElement.vue'
    import ImageElement from './elements/ImageElement.vue'
    import SeparatorElement from './elements/SeparatorElement.vue'

    module.exports = {
        name: 'Module',
        props: ['moduleId', 'module'],
        components: {
            TextElement,
            ButtonElement,
            ImageElement,
            SeparatorElement
        }
    };
</script>