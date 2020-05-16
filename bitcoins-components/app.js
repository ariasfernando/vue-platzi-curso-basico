Vue.component('CoinDetail', {

  props: ['coin'],

  data(){
    return {
      showPrices: false,
      value: 0
    }
  },

  methods: {
    toggleShowPrices() {
      this.showPrices = !this.showPrices;
      this.$emit('change-color');
    }
  },

  computed: {
    converterdValue() {
      if (!this.value) {
        return 0
      }
      return this.value / this.coin.price;
    },
    title(){
      return`${this.coin.name} - ${this.coin.symbol}`
    }
  },

  template: `
    <div>
      <img
        v-on:mouseover="toggleShowPrices"
        v-on:mouseout="toggleShowPrices"
        v-bind:src="coin.img"
        v-bind:alt="coin.name" />

      <h1 v-bind:class="coin.changePercent > 0 ? 'green' : 'red'">
        {{ title }}
        <span v-if="coin.changePercent > 0">👍</span>
        <span v-else-if="coin.changePercent < 0">👎</span>
        <span v-else>🤞</span>
        <span v-on:click="toggleShowPrices">Ver precios{{ showPrices ? '🐵' : '🙈'}}</span>
      </h1>
      
      <input type="number" v-model="value">
      <span>{{ converterdValue }}</span>

      <slot name="text"></slot>
      <slot name="link"></slot>

      <ul v-show=showPrices>
        <li
          v-bind:class="{ orange: p.value === coin.price, red: p.value < coin.price, green: p.value > coin.price }"
          v-for="(p, i) in coin.pricesWithDays" 
          v-bind:key="p.day">
          {{ i }} - {{ p.day }} - {{ p.value }}
        </li>
      </ul>
    
    </div>
  `
});

new Vue({
  el: '#app',
  data() {
    return {
      color: 'F4F4F4',
      btc: {
        name: 'Bitcoin',
        symbol: 'BTC',
        img: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
        changePercent: 10,
        price: 8200,
        pricesWithDays: [
          { day: 'Lunes', value: 8400 },
          { day: 'Martes', value: 7900 },
          { day: 'Miércoles', value: 8200 },
          { day: 'Jueves', value: 9000 },
          { day: 'Viernes', value: 9400 },
          { day: 'Sábado', value: 10000 },
          { day: 'Domingo', value: 10200 },
        ],
        showPrices: false,
      }
    }
  },
  methods: {
    updateColor() {
      this.color = this.color.split('').reverse().join('');
    }
  }
});

/**
 * * Necesidad de conjugar la vertical de conceptos de programación con tecnologías para el plan de capacitación.
 * * Mejorar la documentación existente sobre el producto.
 * * Aplicar accesibilidad como conocimiento.
 * * Utilizar chinwenwencha como equipo de prueba.
 * * Necesidad de tener side-projects específicos para aplicar los conocimientos.
 * * Reforzar la parte teórica por detrás de las tecnologías en uso.
 */