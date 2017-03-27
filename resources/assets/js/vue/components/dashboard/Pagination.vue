<template>
    <div class="pagination">
        <a href="#" v-if="currentPage > 1" class="page available"
            v-on:click.stop.prevent="changePage(currentPage - 1)">Prev</a>
        <a href="#" v-for="n in pages" class="page available"
            v-bind:class="{active: currentPage == n, sliding: !Number.isInteger(n)}"
            v-on:click.stop.prevent="changePage(n)"
        >{{ n }}</a>
        <a href="#" v-if="currentPage < lastPage" class="page available" v-on:click.stop.prevent="changePage(currentPage + 1)">Next</a>
    </div>
</template>

<script>
    export default {
        props: {
            currentPage: {
                type: Number,
                default: 1
            },
            lastPage: {
                type: Number,
                default: 0
            },
            maxPages: {
                type: Number
            }
        },
        computed: {
            pages: function () {
                let pages = [];
                if (this.lastPage <= 1) {
                    return pages;
                }
                if (this.lastPage <= this.maxPages) {
                    for (let i = 1; i <= this.lastPage; i++) {
                        pages.push(i);
                    }
                } else {
                    let numAdjacents = Math.floor((this.maxPages - 3) / 2);
                    if (this.currentPage + numAdjacents > this.lastPage) {
                        let slidingStart = this.lastPage - this.maxPages + 2;
                    } else {
                        let slidingStart = this.currentPage - numAdjacents;
                    }
                    if (slidingStart < 2) {
                        slidingStart = 2;
                    }
                    let slidingEnd = slidingStart + this.maxPages - 3;
                    if (slidingEnd >= this.lastPage) {
                        slidingEnd = this.lastPage - 1;
                    }
                    pages.push(1);
                    if (slidingStart > 2) {
                        pages.push('...');
                    }
                    for ($i = slidingStart; $i <= slidingEnd; $i++) {
                        pages.push($i);
                    }
                    if (slidingEnd < this.lastPage - 1) {
                        pages.push('...');
                    }
                    pages.push(this.lastPage);
                }
                return pages;
            }
        },
        methods: {
            changePage: function (page) {
                if (page !== this.currentPage && page !== '...') {
                    this.$emit('change-page', page);
                }
            }
        }
    }
</script>