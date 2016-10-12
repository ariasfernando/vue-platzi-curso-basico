<script type="text/javascript" src="{{ asset('js/trace.js') }}"></script>
<script type="text/javascript">
    (function(win) {
        stensul_stacktrace.init(win, {
            'app': '{{ strtolower(config('app.name')) }}',
            'url': '{{ url() }}',
            'user_id': '{{ auth()->check() ? auth()->user()->id : 'no-logged-user' }}',
            'environment': '{{ app('env') }}'
        }, {
            'debug': {{ config('app.debug') }}
        })
    })(window);
</script>