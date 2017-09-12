<template>
  <div class="modal-mpf-content-data" id="master-image-editor">
    <h1>{{ module.title }}</h1>
    <form method="post" id="master-image-editor-form">
      <input type="hidden" id="campaign-id" :value="campaignId || ''">

        <!-- image editor upload fields -->

        {{-- File Upload Files --}}
        <upload-field :module="module"></upload-field>
        @include('base.modals.partials.image_editor_upload_fields')

        {{-- Destination URL --}}
        @include('demo.'.$params['library_name'].'.modals.partials.image_editor_default_fields')

        @if ( isset($params["image_crop"]) && $params["image_crop"] == "enabled" && isset($params["multi_crop"]) && $params["multi_crop"] == "enabled" )
            {{-- Multiple tabs --}}
            @include('base.modals.partials.image_editor_multiple_crop_tab')
        @endif

        <!-- Tab panes start  -->
        <div class="tab-content">
            {{-- Crop Default --}}
            @include('base.modals.partials.image_editor_default')

            @if ( isset($params["image_crop"]) && $params["image_crop"] == "enabled" && isset($params["multi_crop"]) && $params["multi_crop"] == "enabled" )
                {{-- crop mobile --}}
                @include('base.modals.partials.image_editor_crop_mobile')
            @endif
        </div>

        {{-- Input submit --}}
        <div class="modal-mpf-submit">
            {!! Form::submit('Submit', array ( 'class' => 'btn btn-success pull-right submit-config')) !!}
        </div>

      {!! Form::close() !!}
  </div>
</template>

<script>
  export default {

  }
</script>

<style lang="less">

</style>