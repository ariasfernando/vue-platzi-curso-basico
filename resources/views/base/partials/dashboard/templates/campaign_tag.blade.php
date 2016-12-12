<span class="st-tag"
	v-on:click="addTag(tag)"
	v-bind:class="this.highlighted ? 'tag-highlight' : ''"
>@{{ tag }}</span>