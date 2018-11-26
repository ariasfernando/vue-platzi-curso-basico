<template>
  <codemirror
    ref="codemirror"
    :value="parse"
    :options="options"
    @input="input" />
</template>

<script>
import {
  codemirror,
} from 'vue-codemirror';
import 'codemirror/lib/codemirror.css';
// languages
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/css/css';
// theme css
import 'codemirror/theme/monokai.css';
// require active-line.js
import 'codemirror/addon/selection/active-line';
// styleSelectedText
import 'codemirror/addon/selection/mark-selection';
import 'codemirror/addon/search/searchcursor';
// hint
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/hint/javascript-hint';
import 'codemirror/addon/hint/css-hint';
// highlightSelectionMatches
import 'codemirror/addon/scroll/annotatescrollbar';
import 'codemirror/addon/search/matchesonscrollbar';
import 'codemirror/addon/search/match-highlighter';
// keyMap
import 'codemirror/mode/clike/clike';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/comment/comment';
import 'codemirror/addon/dialog/dialog';
import 'codemirror/addon/dialog/dialog.css';
import 'codemirror/addon/search/search';
import 'codemirror/keymap/sublime';
// foldGutter
import 'codemirror/addon/fold/foldgutter.css';
import 'codemirror/addon/fold/brace-fold';
import 'codemirror/addon/fold/comment-fold';
import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/indent-fold';
import 'codemirror/addon/fold/markdown-fold';
import 'codemirror/addon/fold/xml-fold';

export default {
  name: 'StCodemirror',
  components: {
    codemirror,
  },
  props: {
    value: {
      type: [String, Object],
      default: '',
    },
    type: {
      type: String,
      default: 'javascript',
      validator(value) {
        return ['css', 'javascript'].indexOf(value) !== -1;
      },
    },
    height: {
      type: String,
      required: true,
    },
    width: {
      type: String,
      default: '100%',
    },
  },
  computed: {
    parse() {
      if (typeof this.value === 'object') {
        return JSON.stringify(this.value, null, 4);
      }
      return Application.utils.isJsonString(this.value) ? JSON.stringify(this.value, null, 4) : String(this.value);
    },
    options() {
      return {
        tabSize: 4,
        styleActiveLine: true,
        lineNumbers: true,
        line: true,
        mode: this.type === 'css' ? 'text/css' : {
          name: 'javascript',
          json: true,
        },
        lineWrapping: true,
        theme: 'monokai',
        styleSelectedText: false,
        foldGutter: true,
        gutters: [
          'CodeMirror-linenumbers',
          'CodeMirror-foldgutter',
        ],
        highlightSelectionMatches: {
          showToken: /\w/,
          annotateScrollbar: true,
        },
        hintOptions: {
          completeSingle: false,
        },
        keyMap: 'sublime',
        matchBrackets: true,
        showCursorWhenSelecting: true,
        extraKeys: {
          Ctrl: 'autocomplete',
        },
      };
    },
  },
  mounted() {
    this.$refs.codemirror.cminstance.setSize(this.width, this.height);
  },
  methods: {
    input(value) {
      this.$emit('input', value);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
