var app = new Vue({
    el: '#music',
    data() {
        return {
            user: [],
            musics: []
        }
    },
    created() {
        fetch('/api/dashboard')
            .then(response => response.json())
            .then(data => (this.user = data))

        fetch('/api/music/save')
            .then(response => response.json())
            .then(data => (this.musics = data))
    }
});