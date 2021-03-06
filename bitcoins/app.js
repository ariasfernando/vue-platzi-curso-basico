new Vue({
  el: '#app',
  data() {
    return {
      name: 'Bitcoin',
      symbol: 'BTC',
      img: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
      changePercent: 10,
      
      prices: [8400, 7900, 8200, 9000, 9400, 10000, 10200],

      value: 0,

      color: 'F4F4F4',

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
      showPrices: false
    }
  },
  watch: {
		showPrices (oldValue, newValue) {
      console.log(oldValue, newValue);
		}
  },
  computed: {
    title(){
      return`${this.name} - ${this.symbol}`
    },
    converterdValue(){
      if(!this.value){
        return 0
      }
      return this.value/this.price;
    }
  },
  methods: {
    toggleShowPrices() {
      this.showPrices = !this.showPrices;
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