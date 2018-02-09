import Element from '../../resources/assets/vue/models/Element';
import Plugin from '../../resources/assets/vue/models/Plugin';

require('dotenv').config();
const chai = require('chai');

const expect = chai.expect;

process.env.APP_ENV = 'test';
/*
 * == Test: Models
 */
describe('== Models ==', () => {
  describe('Elements', () => {
    describe('Element', () => {

      it('Should return a valid object', (done) => {
        const element = new Element({type: 'column-element'});
        expect(element).to.be.an('object');
        done();
      });

      it('Should throw an error if you instance the object without params', (done) => {

        expect(() => {
          /* eslint no-new:0 */
          new Element();
        }).to.throw();

        done();
      });
    });

    describe('Column', () => {
      const element = new Element({type: 'column-element'});
      const properties = element.getProperties();

      it('Should return a valid object', (done) => {
        expect(element).to.be.an('object');
        done();
      });

      it('Should return a valid object of type Column', (done) => {
        expect(properties).to.have.property('type', 'column-element');
        done();
      });

      it('Should only have a specific set of properties', (done) => {
        expect(properties).to.have.keys([
          'type',
          'style',
          'attribute',
          'settings',
          'plugins',
          'components',
        ]);

        done();
      });
    });

    describe('TextElement', () => {
      const element = new Element({type: 'text-element'});
      const properties = element.getProperties();

      it('Should return a valid object', (done) => {
        expect(element).to.be.an('object');
        done();
      });

      it('Should return a valid object of type text-element', (done) => {
        expect(properties).to.have.property('type', 'text-element');
        done();
      });

      it('Should only have a specific set of properties', (done) => {
        expect(properties).to.have.keys([
          'type',
          'style',
          'styleOptions',
          'attribute',
          'settings',
          'plugins',
          'componentSettings',
          'data',
        ]);

        done();
      });
    });

    describe('ImageElement', () => {
      const element = new Element({type: 'image-element'});
      const properties = element.getProperties();

      it('Should return a valid object', (done) => {
        expect(element).to.be.an('object');
        done();
      });

      it('Should return a valid object of type image-element', (done) => {
        expect(properties).to.have.property('type', 'image-element');
        done();
      });

      it('Should only have a specific set of properties', (done) => {
        expect(properties).to.have.keys([
          'type',
          'style',
          'styleOptions',
          'attribute',
          'settings',
          'plugins',
          'componentSettings',
          'data',
        ]);

        done();
      });
    });

    describe('DividerElement', () => {
      const element = new Element({type: 'divider-element'});
      const properties = element.getProperties();

      it('Should return a valid object', (done) => {
        expect(element).to.be.an('object');
        done();
      });

      it('Should return a valid object of type divider-element', (done) => {
        expect(properties).to.have.property('type', 'divider-element');
        done();
      });

      it('Should only have a specific set of properties', (done) => {
        expect(properties).to.have.keys([
          'type',
          'style',
          'attribute',
          'settings',
          'plugins',
          'componentSettings',
          'data',
        ]);

        done();
      });
    });

    describe('SeparatorElement', () => {
      const element = new Element({type: 'separator-element'});
      const properties = element.getProperties();

      it('Should return a valid object', (done) => {
        expect(element).to.be.an('object');
        done();
      });

      it('Should return a valid object of type separator-element', (done) => {
        expect(properties).to.have.property('type', 'separator-element');
        done();
      });

      it('Should only have a specific set of properties', (done) => {
        expect(properties).to.have.keys([
          'type',
          'style',
          'attribute',
          'settings',
          'plugins',
          'componentSettings',
          'data',
        ]);

        done();
      });
    });

    describe('ButtonElement', () => {
      const element = new Element({type: 'button-element'});
      const properties = element.getProperties();

      it('Should return a valid object', (done) => {
        expect(element).to.be.an('object');
        done();
      });

      it('Should return a valid object of type button-element', (done) => {
        expect(properties).to.have.property('type', 'button-element');
        done();
      });

      it('Should only have a specific set of properties', (done) => {
        expect(properties).to.have.keys([
          'type',
          'style',
          'styleOptions',
          'attribute',
          'settings',
          'plugins',
          'componentSettings',
          'data',
        ]);

        done();
      });
    });

  });


  describe('Plugins', () => {

    const testPlugin = {
      name: 'test',
      title: 'Test Plugin',
      target: ['text'],
    };

    const plugin = new Plugin(testPlugin);
    const properties = plugin.getProperties();

    it('Should return a valid object', (done) => {
      expect(plugin).to.be.an('object');
      done();
    });

    it('Should only have a specific set of properties', (done) => {
      expect(properties).to.have.keys([
        'name',
        'title',
        'version',
        'author',
        'target',
        'config',
        'data',
        'render',
        'enabled',
      ]);

      done();
    });
  });

});
