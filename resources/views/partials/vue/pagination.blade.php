<div class="pagination">
	<a href="#" v-if="currentPage > 1" class="page available"
		v-on:click.stop.prevent="changePage(currentPage - 1)">Prev</a>
	<a href="#" v-for="n in pages" class="page available"
		v-bind:class="{active: currentPage == n, sliding: !Number.isInteger(n)}"
		v-on:click.stop.prevent="changePage(n)"
	>@{{ n }}</a>
	<a href="#" v-if="currentPage < lastPage" class="page available"
		v-on:click.stop.prevent="changePage(currentPage + 1)">Next</a>
</div>