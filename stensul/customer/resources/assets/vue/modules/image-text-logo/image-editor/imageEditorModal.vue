<template>
  <transition name="modal">
    <div class="modal-mask" id="master-image-editor">
      <div class="modal-wrapper">
        <div class="modal-container">

          <div class="modal-header">
            <slot name="header">
              <h1>{{ params.title }}</h1>
            </slot>
          </div>
        </div>

        <div class="modal-body">
          <slot name="body">
            <input type="hidden" id="campaign-id" :value="campaignId || ''">

            <!-- image editor upload fields -->
            <upload-field :params="params"></upload-field>

            <!-- Destination URL -->
            <div class="modal-two-column">
              <!-- Input destination url image -->
              <div class="modal-mpf-row">
                <label>Destination URL</label>
                <input type="text" id="image-destination-url" class="image-destination-url url-format"
                       placeholder="https://www.example.com" data-validation="{ 'required': 'false', 'url': 'true'}">
              </div>

              <!-- Input alt image -->
              <div class="modal-mpf-row">
                <label>Alternative text</label>
                <input type="text" id="image-alt-text" class="image-alt-text" placeholder="Enter alt text here">
              </div>
            </div>
            <!-- /Destination URL -->

            <div v-if="params.multiCrop && params.multiCrop === 'enabled'" class="container-tabs-multi-crop">
              <ul class="nav nav-tabs" role="tablist">
                <li role="presentation" class="active">
                  <a href="#image-cropper" aria-controls="image-cropper" role="tab" data-toggle="tab">
                    <i class="glyphicon glyphicon-fullscreen"></i>Desktop
                    </a>
                </li>
                <li role="presentation">
                  <a href="#image-cropper-mobile" aria-controls="image-cropper-mobile" role="tab" data-toggle="tab">
                    <i class="glyphicon glyphicon-phone"></i>Mobile
                    </a>
                </li>
              </ul>
            </div>

            <!-- Tab panes start  -->
            <div class="tab-content">
              <!-- Crop Default -->
              <image-editor :params="params"></image-editor>

              <!-- crop mobile -->
              <image-editor-mobile v-if="mobileEditor" :params="params"></image-editor-mobile>
            </div>
          </slot>
        </div>

        <div class="modal-footer">
          <slot name="footer">
            <!-- Input submit -->
            <div class="modal-mpf-submit">
              <input type="submit" class="btn btn-success pull-right submit-config">
            </div>
          </slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>

  import imageEditor from './components/imageEditor.vue';
  import imageEditorMobile from './components/imageEditorMobile.vue';
  import uploadField from './components/uploadField.vue';

  export default {
    components: {
      imageEditor,
      uploadField,
      imageEditorMobile
    },
    data() {
      return {
        mobileEditor: params.imageCrop && params.imageCrop === 'enabled' && params.multiCrop && params.multiCrop === 'enabled',
      }
    }

  }
</script>