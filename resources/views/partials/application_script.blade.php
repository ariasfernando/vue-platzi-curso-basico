<script type="text/javascript">
	var Application = Application || {};
	Application.globals = Application.globals || {};

	Application.globals.baseUrl = "{{ url('/') }}";
	Application.globals.cdnHost = "{{ Config::get('view.suite_cdn_host') }}";
	Application.globals.imageUrl = "{{ url('/') }}/images/";
	Application.globals.campaignImageUrl = "{{ url('/') }}/images/campaigns";
	Application.globals.modalsConfig = <?php echo json_encode( Config::get('modals') ); ?>;
	Application.globals.library_name = "<?php echo (isset($params['campaign_data']) && isset($params['campaign_data']['library']))? $params['campaign_data']['library'] : 'default'; ?>";
	Application.globals.emailWidth = "<?php echo (isset($params['campaign_data']))? $params['campaign_data']->getLibraryConfig('template_width') : '660'; ?>";
	Application.globals.emailMobileWidth = "<?php echo (isset($params['campaign_data']))? $params['campaign_data']->getLibraryConfig('template_mobile_width') : '320'; ?>";
    Application.globals.processPlainText = ("{{ $app_config["campaign"]["process_plaintext"]  }}")? true : false;
	Application.globals.logged_user = "{{ (Auth::user()) ? Auth::user()->email : ''}}";
	{{-- @TODO Use configService from Vue resources/assets/vue/services/config.js --}}
	Application.globals.proofConfig = {!! json_encode(Config::get('proof')) !!};
	Application.globals.csrfToken = "{{ csrf_token() }}";
	Application.globals.permissions = {!! json_encode(Auth::user()->getPermissions()) !!};
	Application.globals.preheaderConfig = {!! json_encode(Config::get('view.preheader')) !!};
	Application.globals.validateUrlExists = ("{{ $app_config["campaign"]["validate_url_exists"]  }}") ? true : false;
	Application.globals.validateUrlSettings = <?php echo (is_array($app_config['campaign']['validate_url_settings']) ? json_encode($app_config['campaign']['validate_url_settings']) : '[]') ?>;
	Application.globals.showPopularTags = ("{{ isset($app_config["campaign"]["search_settings"]["show_popular_tags"]) && $app_config["campaign"]["search_settings"]["show_popular_tags"]  }}") ? true : false;
</script>
