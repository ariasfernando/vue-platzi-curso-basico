<template>
  <div class="column-settings section-box" v-if="module">
    <h2>
      <i class="glyphicon glyphicon-pause"></i> Column Styles
    </h2>
    <div class="module-plugins" v-if="hasEnabledPlugins(module)">

      <div v-for="(plugin, key) in module.plugins" class="plugin-wrapper" :class="'plugin-' + plugin.name">
        <component v-if="plugin.enabled && $globalComponents.indexOf('campaign-' + plugin.name) !== -1" :is="'campaign-' + plugin.name" :name="key" :plugin="plugin"></component>
      </div>
    </div>

    <div class="column-plugins">
      <b-card class="control container-fluid" no-block>
        <b-tabs card ref="tabs">
          <b-tab v-for="(column, columnKey) in module.structure.columns" v-if="hasEnabledPlugins(column)"
                 :title="`${columnKey+1}`" :button-id="`column-${columnKey}`" :key="columnKey">
            <div v-for="(plugin, moduleKey) in column.plugins" class="plugin-wrapper" :class="'plugin-' + plugin.name">
              <component v-if="plugin.enabled && $globalComponents.indexOf('campaign-' + plugin.name) !== -1"
                         :is="'campaign-' + plugin.name" :name="moduleKey" :plugin="plugin"
                         :column-id="columnKey" :module-id="currentModule"></component>
            </div>
          </b-tab>
        </b-tabs>
      </b-card>

    </div>
  </div>
</template>

<script>
  import _ from 'lodash'
  import uc from 'underscore-contrib'
  import defaultElements from '../../resources/elements'

  export default {
    data () {
      return {
        ready: false,
      }
    },
    computed: {
      currentModule() {
        return this.$store.getters["campaign/currentModule"];
      },
      modules() {
        return this.$store.getters["campaign/modules"];
      },
      module() {
        return this.modules[this.currentModule];
      }
    },
    watch : {
      currentColumn: {
        handler: function() {
          let modules = this.$store.getters["campaign/modules"];
          if (this.currentModule && this.currentColumn) {
            this.column = modules[this.currentModule].structure.columns[this.currentColumn];
            this.ready = true;
          }
        },
        deep: true
      },
    },
    methods: {
      hasEnabledPlugins(o) {
        let enabled = false;
        _.each(o.plugins, (plugin) => {
          if (plugin.enabled) {
            enabled = true;
          }
        });
        return enabled;
      }
    }
  }
</script>

<style lang="less"> 
  @focus: #78DCD6;
  @focus-light: lighten(@focus, 30%);

  .vue-js-switch {
    margin-top: 4px
  }

  .plugin-wrapper {
    display: inline-block;
    width: 100%;

    div:first-child{
      margin-bottom: 10px;
    }

    div:empty{
      margin-bottom: 0px;
    }
  }
  aside{
    .column-settings{
      background: #ffffff;

      h2{
        color: #555555;
        font-weight: 300;
        font-size: 13px;
        padding: 15px 10px 13px 10px;
        border-bottom: 1px solid #F0F0F0;
        margin-top: 0px;
        text-transform: uppercase;
      }

      .card-header{
        padding-bottom: 0px;

        ul{
          margin-left: -10px;
          margin-right: -10px;
          border-bottom: 1px solid #DDDDDD;

          .nav-item{
            border-top: 1px solid #DDDDDD;
            border-left: 1px solid #DDDDDD;
            margin-bottom: -2px;

            &:first-child{
              margin-left: 10px;
            }

            &:last-of-type{
              border-right: 1px solid #DDDDDD;
            }
            .nav-link{
              margin-right:0;
              padding: 4px 7px;
              border: 0;
              border-radius:0;
              font-weight: 300;
              color: #666666;
              &.active{
                border-bottom: 2px solid @focus;
                background: @focus-light;
              }
              &:focus{
                background-color: transparent;
              }
              &:hover{
                background-color:@focus-light;
              }
            } 
          }

          &:empty{
            border-bottom: none;
          }
        }
      }

      .column-plugins{
        padding: 10px;

        .container-fluid{
          padding: 0px;

          label{
            text-align: left;
            color: #666666;
            padding-top: 2px;
            font-weight: 300;
            font-size: 13px;
            margin-bottom: 0px;
          }

          input[type=text]{
            height: 22px;
            background: #F4F4F4;
            border-radius: 2px;
            border: none;
            float: right;
            font-size: 11px;
            font-weight: 300;
            width: 120px;
          }

          select{
            height: 22px;
            font-size: 11px;
            color: #666666;
            border: none;
            background: #f4f4f4;
            box-shadow: none;
            font-weight: 300;
            width: 75px;
            float: right;
          }
        }

        h2{
          color: #555555;
          font-weight: 300;
          font-size: 13px;
          padding: 15px 10px 13px 10px;
          border-bottom: 1px solid #F0F0F0;
          margin-top: 0px;
          text-transform: uppercase;
          margin-left: -10px;
          margin-right: -10px;
        }
      }

      .module-plugins{
        padding: 10px;

        h2{
          color: #555555;
          font-weight: 300;
          font-size: 13px;
          padding: 15px 10px 13px 10px;
          border-bottom: 1px solid #F0F0F0;
          margin-top: 0px;
          text-transform: uppercase;
          margin-left: -10px;
          margin-right: -10px;
        }

        label{
          text-align: left;
          color: #666666;
          padding-top: 2px;
          font-weight: 300;
          font-size: 13px;
          margin-bottom: 0px;
        }

        input[type=text]{
          height: 22px;
          background: #F4F4F4;
          border-radius: 2px;
          border: none;
          float: right;
          font-size: 11px;
          font-weight: 300;
          width: 120px;
        }

        select{
          height: 22px;
          font-size: 11px;
          color: #666666;
          border: none;
          background: #f4f4f4;
          box-shadow: none;
          font-weight: 300;
          width: 75px;
          float: right;
        }
      }
    }
  }
</style>