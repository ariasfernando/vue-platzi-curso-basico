<template>
  <div>
    <div>
      <ul class="nav nav-tabs" role="tablist">
          <li role="presentation" class="active"><a href="#file-upload-box" class="btn-upload" role="tab" data-toggle="tab"><i class="glyphicon glyphicon-cloud-upload"></i>File Upload</a></li>
          <li role="presentation"><a href="#" class="btn-image-library"><i class="glyphicon glyphicon-picture"></i>Library</a></li>
      </ul>
    </div>

    <div class="tab-content" id="tab-content">

        <div class="tab-pane active modal-mpf-row file-tab-section section-upload-file" role="tabpanel" id="file-upload-box">
          <label>Maximum allowed size: 2mb. Allowed file types: png, jpg and gif.</label>
          <input type="file" id="file-image-upload" class="cropit-image-input" data-validation="{'required': 'false'" accept="image/*">
        </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['module'],
  }
</script>