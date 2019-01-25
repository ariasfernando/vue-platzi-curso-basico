export default {
  props: {
    muteOn: {
      type: [Array],
      default() {
        return [];
      },
    },
  },
  computed: {
    isMuted() {
      return this.muteOn.includes(this.value);
    },
  },
};

