{{-- this url will be change later --}}
<script type="text/javascript" src="{{ asset('js/debug.js') }}"></script>
<script type="text/javascript">
    (function(win) {
        stensul_stacktrace.init(win, {
            'app': '{{ strtolower(config('app.name')) }}',
            'url': '{{ url() }}',
            'user_id': '{{ auth()->check() ? auth()->user()->id : 'no-logged-user' }}',
            'environment': '{{ app('env') }}',
            'version': '{{ config('app.version') }}'
        }, {
            'debug': {{ config('app.debug') }}
        })
    })(window);
</script>