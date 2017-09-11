<?php
$path = url('/public/html/' . $campaign_id );
?>
@extends('layouts.preview')
@section('content')

    <div class="col-xs-12">

        <div class="section-container-campaign">

            <!-- column right (container email) -->
            <section class="section-canvas-email section-box">
                @include('partials.campaign.modal_campaign_preview')
            </section>
        </div>

    </div>

@endsection

@section('footer-script')
    <script src="{{ cdn( elixir('js/preview.js') ) }}"></script>
    
@stop
