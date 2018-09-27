/* eslint-env node, jest, es6 */
/* eslint max-nested-callbacks: 0 */
import Element from '../../resources/assets/vue/models/Element';
import Plugin from '../../resources/assets/vue/models/Plugin';

require('dotenv').config();

process.env.APP_ENV = 'test';
/*
 * == Test: Models
 */
describe('== Models ==', () => {
  describe('Elements', () => {
    describe('Element', () => {
      it('Should return a valid object', (done) => {
        let element = new Element({ type: 'column-element' });
        expect(typeof element).toBe('object');
        element = null;
        done();
      });

      it('Should throw an error if you instance the object without params', (done) => {
        expect(() => {
          /* eslint no-new:0 */
          new Element();
        }).toThrow();

        done();
      });
    });

    describe('Column', () => {
      let element = {};
      let properties = {};
      beforeAll(() => {
        element = new Element({ type: 'column-element' });
        properties = element.getProperties();
      });
      afterAll(() => {
        element = null;
        properties = null;
      });
      it('Should return a valid object', (done) => {
        expect(typeof element).toBe('object');
        done();
      });

      it('Should return a valid object of type Column', (done) => {
        expect(properties).toHaveProperty('type', 'column-element');
        done();
      });

      it('Should only have a specific set of properties', (done) => {
        expect(Object.keys(properties).sort()).toEqual([
          'id',
          'type',
          'container',
          'content',
          'plugins',
          'components',
        ].sort());

        done();
      });
    });

    describe('TextElement', () => {
      let element = {};
      let properties = {};
      beforeAll(() => {
        element = new Element({ type: 'text-element' });
        properties = element.getProperties();
      });
      afterAll(() => {
        element = null;
        properties = null;
      });
      it('Should return a valid object', (done) => {
        expect(typeof element).toBe('object');
        done();
      });

      it('Should return a valid object of type text-element', (done) => {
        expect(properties).toHaveProperty('type', 'text-element');
        done();
      });

      it('Should only have a specific set of properties', (done) => {
        expect(Object.keys(properties).sort()).toEqual([
          'id',
          'type',
          'container',
          'text',
          'plugins',
          'data',
        ].sort());

        done();
      });
    });

    describe('ImageElement', () => {
      let element = {};
      let properties = {};
      beforeAll(() => {
        element = new Element({ type: 'image-element' });
        properties = element.getProperties();
      });
      afterAll(() => {
        element = null;
        properties = null;
      });
      it('Should return a valid object', (done) => {
        expect(typeof element).toBe('object');
        done();
      });

      it('Should return a valid object of type image-element', (done) => {
        expect(properties).toHaveProperty('type', 'image-element');
        done();
      });

      it('Should only have a specific set of properties', (done) => {
        expect(Object.keys(properties).sort()).toEqual([
          'id',
          'type',
          'container',
          'image',
          'plugins',
          'data',
        ].sort());

        done();
      });
    });

    describe('DividerElement', () => {
      let element = {};
      let properties = {};
      beforeAll(() => {
        element = new Element({ type: 'divider-element' });
        properties = element.getProperties();
      });
      afterAll(() => {
        element = null;
        properties = null;
      });
      it('Should return a valid object', (done) => {
        expect(typeof element).toBe('object');
        done();
      });

      it('Should return a valid object of type divider-element', (done) => {
        expect(properties).toHaveProperty('type', 'divider-element');
        done();
      });

      it('Should only have a specific set of properties', (done) => {
        expect(Object.keys(properties).sort()).toEqual([
          'id',
          'type',
          'container',
          'divider',
          'plugins',
          'data',
        ].sort());

        done();
      });
    });

    describe('ButtonElement', () => {
      let element = {};
      let properties = {};
      beforeAll(() => {
        element = new Element({ type: 'button-element' });
        properties = element.getProperties();
      });
      afterAll(() => {
        element = null;
        properties = null;
      });
      it('Should return a valid object', (done) => {
        expect(typeof element).toBe('object');
        done();
      });

      it('Should return a valid object of type button-element', (done) => {
        expect(properties).toHaveProperty('type', 'button-element');
        done();
      });

      it('Should only have a specific set of properties', (done) => {
        expect(Object.keys(properties).sort()).toEqual([
          'id',
          'type',
          'container',
          'button',
          'caret',
          'plugins',
          'data',
        ].sort());

        done();
      });
    });
  });

  describe('Plugins', () => {
    let testPlugin = {};
    let plugin = {};
    let properties = {};
    beforeAll(() => {
      testPlugin = {
        name: 'test',
        title: 'Test Plugin',
        target: ['text'],
      };
      plugin = new Plugin(testPlugin);
      properties = plugin.getProperties();
    });
    afterAll(() => {
      testPlugin = null;
      plugin = null;
      properties = null;
    });
    it('Should return a valid object', (done) => {
      expect(typeof plugin).toBe('object');
      done();
    });

    it('Should only have a specific set of properties', (done) => {
      expect(Object.keys(properties).sort()).toEqual([
        'name',
        'title',
        'version',
        'author',
        'target',
        'config',
        'data',
        'render',
        'enabled',
      ].sort());

      done();
    });
  });
});
