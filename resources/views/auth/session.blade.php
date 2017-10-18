{{-- Extend master layout --}}
@extends('layouts.public')

{{-- For an empty header --}}
@section('header')
@stop

{{-- Login content --}}
@section('content')
	<section class="col-md-4 col-sm-1 col-xs-1"></section>
	<section class="col-md-4 col-sm-10 col-xs-10 beta-login">

		<div class="text-center">
			<form class="form-horizontal">

				@if ( isset($error) )
					<div class="alert alert-danger" role="alert">
						The account you attempted to login with is not authorized for access.<br/>
						To gain access, please email <a href="mailto:info@stensul.com">info@stensul.com</a>
					</div>

					<div class="form-group submit-row">
						<div class="text-center">
							<a href="#" class="btn btn-default" onclick="javascript:self.close();">Close</a>
						</div>
					</div>
				@else
				    <script type="text/javascript">
						window.opener.location.href = '{{ $redirect_to }}';
						self.close();
				    </script>
				@endif

			</form>
		</div>
	</section>
	<section class="col-md-4 col-sm-1 col-xs-1"></section>
@endsection