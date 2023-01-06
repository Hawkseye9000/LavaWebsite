var app = new Vue({
    el: '#dashboard',
    data() {
        return {
            user: [],
            guilds: [],
            session: [],
        }
    },
    created() {
        fetch('/api/dashboard')
            .then(response => response.json())
            .then(data => (this.user = data))

        fetch('/api/user')
            .then(response => response.json())
            .then(data => (this.guilds = data.user.guilds))
    }
});