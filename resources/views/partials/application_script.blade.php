<script type="text/javascript">
	var Application = Application || {};
	Application.globals = Application.globals || {};

	Application.globals.baseUrl = "{{ url('/') }}";
	Application.globals.cdnHost = "{{ Config::get('view.suite_cdn_host') }}";
	Application.globals.imageUrl = "{{ url('/') }}/images/";
	Application.globals.imagePathCustom = "{{ str_replace(config('filesystems.public_image_path'), '', config('filesystems.disks.local:modules.root')) }}";
	Application.globals.imageUrlCustom = Application.globals.imageUrl + Application.globals.imagePathCustom;
	Application.globals.imagePathStudio = "{{ str_replace(config('filesystems.public_image_path'), '', config('filesystems.disks.local:modules:studio.root')) }}";
	Application.globals.imageUrlStudio = Application.globals.imageUrl + Application.globals.imagePathStudio;
	Application.globals.campaignImageUrl = Application.globals.imageUrl + "campaigns";
	Application.globals.library_name = "<?php echo (isset($params['campaign_data']) && isset($params['campaign_data']['library']))? $params['campaign_data']['library'] : 'default'; ?>";
	Application.globals.logged_user = "{{ (Auth::user()) ? Auth::user()->email : ''}}";
	{{-- @TODO Use configService from Vue resources/assets/vue/services/config.js --}}
	Application.globals.proofConfig = {!! json_encode(Config::get('proof')) !!};
	Application.globals.csrfToken = "{{ csrf_token() }}";
	Application.globals.permissions = {!! Auth::user() ? json_encode(Auth::user()->getPermissions()) : "{}" !!};
	Application.globals.preheaderConfig = {!! json_encode(Config::get('view.preheader')) !!};
	Application.globals.validateUrlExists = ("{{ $app_config["campaign"]["validate_url_exists"]  }}") ? true : false;
	Application.globals.validateUrlSettings = <?php echo (is_array($app_config['campaign']['validate_url_settings']) ? json_encode($app_config['campaign']['validate_url_settings']) : '[]') ?>;
	Application.globals.showPopularTags = ("{{ isset($app_config["campaign"]["search_settings"]["show_popular_tags"]) && $app_config["campaign"]["search_settings"]["show_popular_tags"]  }}") ? true : false;
	Application.globals.cleanEmptyLinks = ("{{ isset($app_config["campaign"]["clean_empty_links"]) && $app_config["campaign"]["clean_empty_links"] }}") ? true : false;
	Application.globals.sieAPI = {url: "{{env('SIE_URL')}}", token: "{{env('SIE_TOKEN')}}"};
</script>
