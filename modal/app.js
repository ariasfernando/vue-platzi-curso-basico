Vue.component('modal', {

    props: ['title'],

    methods: {
        closeModal(){
            this.$emit('close');
        }
    },
    template: `
      <div class="modal-mask">
        <div class="modal-wrapper">
          <div class="modal-container">
            <h3>{{ title }}</h3>
            <slot></slot>
            <footer>
              <button v-on:click="closeModal">Cerrar</button>
            </footer>
          </div>
        </div>
      </div>`
  })
  
  new Vue({
    el: '#app',
    data() {
        return {
            showModal: false,
            title: "Modal!"
        }
    },
    methods: {
        toggleModal() {
            this.showModal = !this.showModal;
        }
    }
  })