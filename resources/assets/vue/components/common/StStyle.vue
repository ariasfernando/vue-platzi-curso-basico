<template>
  <span />
</template>

<script>
import cssom from 'cssom';

export default {
  props: {
    prefix: {
      type: String,
      default: undefined,
    },
    mediaQueryPrefix: {
      type: String,
      default: undefined,
    },
    content: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      parsed: '',
    };
  },
  watch: {
    content(value) {
      this.parseContent(value);
    },
  },
  beforeDestroy() {
    document.head.removeChild(this.$refs.style);
  },
  mounted() {
    this.$refs.style = document.createElement('style');
    this.$refs.style.type = 'text/css';
    this.parseContent(this.content);
    document.head.appendChild(this.$refs.style);
  },
  methods: {
    parseContent(value) {
      this.parsed = '';
      const parser = new DOMParser();
      const el = parser.parseFromString(value, 'text/xml');
      if (el.childNodes) {
        for (let i = 0; i < el.childNodes.length; i++) {
          if (el.childNodes[i].nodeName === 'style') {
            const style = cssom.parse(el.childNodes[i].innerHTML);
            if (style.cssRules) {
              style.cssRules = this.forEachRule(style.cssRules);
              for (let index = 0; index < style.cssRules.length; index++) {
                this.parsed = this.parsed + style.cssRules[index].cssText;
              }
            }
          }
        }
      }
      this.$refs.style.innerHTML = this.parsed.toString();
    },
    forEachRule(rules, media = false) {
      for (let k = 0; k < rules.length; k++) {
        if (rules[k].cssRules) {
          rules[k].cssRules = this.forEachRule(rules[k].cssRules, (rules[k].media));
        } else if (rules[k].selectorText) {
          rules[k].selectorText = this.newSelector(rules[k].selectorText, media);
          if (media) {
            this.parsed = this.parsed + rules[k].cssText;
          }
        }
      }
      return rules;
    },
    newSelector(old, media = false) {
      let prefix = this.prefix ? `${this.prefix} ` : '';
      if (media) {
        prefix = this.mediaQueryPrefix ? `${this.mediaQueryPrefix} ` : '';
      }
      return `${prefix}${old}`;
    },
  },
};
</script>
