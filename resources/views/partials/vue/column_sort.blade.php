<a href="#" v-on:click.stop.prevent="sortBy(field)">
	@{{ title }}
	<i class="glyphicon pull-right" v-bind:class="sortClass"></i>
</a>