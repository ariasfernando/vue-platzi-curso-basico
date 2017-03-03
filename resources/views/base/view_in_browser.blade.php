<?php
$path = url('/public/html/' . $campaign_id );
?>
@extends('base.layouts.preview')
@section('content')

    <div class="col-xs-12">

        <div class="section-container-campaign">

            <!-- columon right (container email) -->
            <section class="section-canvas-email section-box">
                @include('base.partials.campaign.modal_campaign_preview')
            </section>
        </div>

    </div>

@endsection

@section('footer-script')
    <script src="{{ cdn( elixir('js/preview.js') ) }}"></script>
    
@stop
