import Course from './course.model.js';

new Vue({
    el: '#app',

    data() {
        return {
            courses: [
            ],
            title: '',
            time: null
        }
    },

    computed: {
        totalTime() {
            return this.courses.reduce( (hours, course) => hours + parseInt(course.time), 0);
        }
    },

    methods: {
        saveCourse() {
            this.courses.push( new Course(this.title, this.time) );
        }
    }
})