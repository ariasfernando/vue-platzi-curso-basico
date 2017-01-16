<div id="image-library-modal" class="modal fade display-code-modal" tabindex="-1" role="dialog" aria-hidden="true">
	<div class="modal-dialog modal-lg">
		<div class="modal-content">
			<div class="modal-content-overlay"></div>
			<div class="modal-header">
				<h4 class="modal-title">{{ $params["title"] }}</h4>
				<div class="last-update">
					Last update: <span id="last-update-label"></span>
					<a href="#" class=""><i class="glyphicon glyphicon-refresh"></i></a>
				</div>
				<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
			</div>
			<div class="modal-body">
				<div class="row gallery-container"></div>
			</div>
			<div class="modal-footer">
				<button class="btn btn-default" data-dismiss="modal">Cancel</button>
				<a href="#" class="btn btn-continue disabled" id="btn-submit">Submit</a>
			</div>
		</div>
	</div>
</div>
