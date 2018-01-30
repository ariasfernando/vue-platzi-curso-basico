<template>
  <!-- TEXT ELEMENT -->
  <tr 
    data-type="text-element"
    :data-component="JSON.stringify(component)"
    :data-column="columnId"
    @click.prevent="setComponent"
  >
    <td width="100%" style="width: 100%;">
      <table 
        width="100%" 
        cellpadding="0" 
        cellspacing="0" 
        border="0" 
        align="center" 
        style="width: 100%;"
      >
        <tr>
          <td 
            width="100%" 
            class="stx-edit-text stx-position-relative" 
            :align="component.attribute.align"
            :bgcolor="component.attribute.bgcolor.hex"
            :truncate="component.attribute.truncate"
            :style="component.style"
            @keydown="onKeyDown"
            @paste="onPaste"  
          >
            <tiny-mce :id="editorId" :value="component.data.text" data-key="text"></tiny-mce>
            <component-toolbar :component-id="componentId" :column-id="columnId"></component-toolbar>
          </td>
        </tr> 
      </table>     
    </td> 
  </tr>
  <!-- TEXT ELEMENT ENDS -->
</template>

<script>
  import TinyMCE from './TinyMce.vue';
  import ComponentToolbar from './ComponentToolbar.vue';
  import _ from 'underscore';

  export default {
    name: 'TextElement',
    props: [
      'module-id',
      'column-id',
      'component-id',
      'component'
    ],
    components: {
      'tiny-mce': TinyMCE,
      ComponentToolbar,
    },
    data(){
      return {
        editorId: ['editor', this.columnId, this.componentId].join('-'),
        dirty: false
      }
    },
    computed: {
      styleComponent() {
        return this.$store.getters["module/changeSettingComponent"];
      },
      currentComponent() {
        return this.$store.getters["module/currentComponent"];
      }
    },
    watch : {
      styleComponent: {
        handler: function() {
          if (!_.isEmpty(this.styleComponent) &&
            this.currentComponent.columnId === this.columnId &&
            this.currentComponent.componentId === this.componentId )
          {
            this.component.style = this.styleComponent.style;
            this.component.attribute = this.styleComponent.attribute;
          }
        },
        deep: true  
      },
    },
    timeoutID: null,
    methods: {
      setComponent(e) {
        if (!$(e.target).hasClass("st-remove")){
          this.$store.commit("module/setCurrentComponent", {
            columnId: this.columnId,
            componentId: this.componentId
          });

          this.$store.commit('module/setChangeSettingComponent',{
            style: this.component.style || {},
            attribute: this.component.attribute || {}
          });
        }  
      },
      //truncate on Keydown
      onKeyDown(e){
        // Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||
              // Allow: Ctrl+A, Command+A
            (e.keyCode == 65 && ( e.ctrlKey === true || e.metaKey === true ) ) ||
              // Allow: home, end, left, right, down, up
            (e.keyCode >= 35 && e.keyCode <= 40)) {
                  // let it happen, don't do anything
                  return;
        }
        let $el= $(e.currentTarget);
        let maxLength = $el.attr('truncate');
        
        console.log($el.text().length);
        
        if (!(_.isUndefined(maxLength))){
          let truncated = $(e.target).text().trim();
          if (truncated.length >= maxLength) {
              e.preventDefault();
              return;
          }
        }
      },
      //truncate on paste
      onPaste (e) {
        e.preventDefault();
				let text = (e.originalEvent || e).clipboardData.getData('text/plain') || prompt('Paste something..');
				document.execCommand('insertText', false, text);
        console.log(text);
        // Truncate pasted text if truncate attr is present
        let $el = $(e.currentTarget);
        let maxLength = $el.attr('truncate');
        if ( !(_.isUndefined(maxLength)) ) {
          if ($el.text().trim().length >= maxLength) {
						this.$emit($el.text().trim().substring(0, maxLength));
					}
				}
      }
    }
  };
</script>

<style lang="less">
  .stx-position-relative{
    position: relative;
  }

  .stx-edit-text{
    p{
      margin: 0;
      padding: 0;
    }
  }
</style>