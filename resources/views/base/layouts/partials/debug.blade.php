@if (!\App::environment('local'))
    <script type="text/javascript" src="{{ config('app.debug_url') }}"></script>
    <script type="text/javascript">
        (function(win) {
            stensul_stacktrace.init(win, {
                'app': '{{ strtolower(config('app.name')) }}',
                'url': '{{ url()->full() }}',
                'user_id': '{{ auth()->check() ? auth()->user()->id : 'no-logged-user' }}',
                'environment': '{{ app('env') }}',
                'version': '{{ config('app.version') }}'
            }, {
                'debug': {{ config('app.debug') ? 'true' : 'false' }}
            });
        })(window);
    </script>
@endif