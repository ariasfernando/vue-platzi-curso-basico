<template>
	<div :id="attrId" :role="attrTabPanel" :class="containerClass" >

		<!-- Image Preview -->
		<div class="section-box preview-box">

			<div class="modal-two-column">
				<!-- Image Zoom -->
				<zoom-control v-if="params.imageCrop"></zoom-control>

				<!-- Image height control -->
				<height-control v-if="params.adjustableHeight"></height-control>

				<!-- Image overlay control -->
				<overlay-control v-if="params.imageOverlayControl"></overlay-control>

				<div v-for="overlay in params.overlays">
					<custom-overlay-control :input-id="overlay.controlId" :label="overlay.controlLabel"></custom-overlay-control>
				</div>

				<!-- Image width control -->
				<width-control></width-control>
			</div>

			<div class="section-title"><h2>Preview Image</h2></div>

			<div class="cropit-preview">

				<!-- Image overlay -->

				<img v-if="params.imageOverlayConfig" border="0" style="display:block; border:none;"
						 :class="params.imageOverlayConfig.imageClass || 'image-overlay'"
						 :alt="params.imageOverlayConfig.imageAlt"
						 :width="params.imageOverlayConfig.imageWidth"
						 :height="params.imageOverlayConfig.imageHeight">

				<!-- Text overlay -->
				<div v-if="params.textOverlay" id="text-overlay" class="text-overlay">
					<div class="prevent-overflow"><div id="text-editable" class="text-editable">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet</div></div>
				</div>

				<!-- Text overlay -->

				<div v-for="overlay in params.overlays">

					<img v-if="overlay.type === 'image'" class="image-overlay"
							 :id="overlay.id || ''"
							 :src="$app.baseUrl + overlay.path || ''"
							 :class="overlay.class || ''"
							 :width="overlay.width || 'auto'"
							 :height="overlay.height || 'auto'"
							 border="0"
							 style="display:block; border:none;" />

					<div v-if="overlay.type === 'text'" :id="overlay.id || ''" class="st-html-overlay" :class="overlay.class || ''">
						<div :id="(overlay.id || '') + '-editor'" contenteditable="true"
								 :data-save-as="overlay.saveAs || ''" v-html="overlay.default || ''"></div>
						<div class="toolbox"></div>
					</div>

					<div v-if="overlay.type === 'richText'" class="rich-text-container st-html-overlay" :id="overlay.id || ''">
						<div :id="(overlay.id || 'text') + '-editor'" :class="overlay.class || ''"
								 :data-save-as="overlay.saveAs || ''" v-html="overlay.default || ''"></div>
						<div class="toolbox rich-text-toolbox"></div>
					</div>

				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import * as components from '../index';

	export default {
	  props: ['params'],
	  components: {
	    zoomControl: components.zoomControl,
			heightControl: components.heightControl,
			widthControl: components.widthControl,
			overlayControl: components.overlayControl,
			customOverlayControl: components.customOverlayControl
		},
	  data() {
	    return {
	      attrId() {
          return this.params.imageCrop && this.params.imageCrop === 'enabled' ? 'image-cropper' : '';
        },
				attrTabPanel() {
	        return this.params.imageCrop && this.params.imageCrop === 'enabled' && this.params.multiCrop && this.params.multiCrop === 'enabled' ? 'tabpanel' : '';
        },
				containerClass() {
	        const initCropperClass = params.imageCrop && params.imageCrop === 'enabled' ? 'init-cropper' : '';
	        const tabClass = this.params.imageCrop && this.params.imageCrop === 'enabled' && this.params.multiCrop && this.params.multiCrop === 'enabled' ? 'tab-pane active' : '';

	        return [initCropperClass, tabClass].join(' ');
				},
			}
		}
	}
</script>