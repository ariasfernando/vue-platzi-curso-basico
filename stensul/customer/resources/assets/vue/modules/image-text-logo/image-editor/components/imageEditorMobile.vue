<template>
  <div :id="attrId" :role="attrTabPanel" :class="containerClass">
    <!-- Image Preview -->
    <div class="section-box preview-box">
      <div :class="columns">
        <!-- Image Zoom -->
        <zoom-control></zoom-control>

        <!-- Image height control -->
        <height-control></height-control>
      </div>

      <div class="section-title"><h2>Preview Image</h2></div>

      <div class="cropit-preview"></div>
    </div>
  </div>
</template>

<script>
  import { heightControl } from '../index';
  import { zoomControl } from '../index';

  export default {
    props: ['params'],
    components: {
      heightControl,
      zoomControl
    },
    data() {
      return {
        attrId: this.params.multiCrop && this.params.multiCrop === 'enabled' ? 'image-cropper-mobile' : '',
				attrTabPanel: this.params.imageCrop && this.params.imageCrop === 'enabled' && this.params.multiCrop && this.params.multiCrop === 'enabled' ? 'tabpanel' : '',
        containerClass() {
	        const initCropperClass = params.imageCrop && params.imageCrop === 'enabled' ? 'init-cropper' : '';
	        const tabClass = this.params.imageCrop && this.params.imageCrop === 'enabled' && this.params.multiCrop && this.params.multiCrop === 'enabled' ? 'tab-pane' : '';

	        return [initCropperClass, tabClass].join(' ');
				},
        columns: this.params.imageCrop === 'enabled' && this.params.imageOverlay === 'enabled' || this.params.adjustableHeight === 'enabled' ? 'module-two-column' : '';
      }
    }
  }
</script>