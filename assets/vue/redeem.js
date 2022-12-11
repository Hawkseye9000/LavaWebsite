var app = new Vue({
    el: '#redeem',
    data() {
        return {
            user: [],
            tokens: []
        }
    },
    created() {
        fetch('/api/dashboard')
            .then(response => response.json())
            .then(data => (this.user = data))

        fetch('/api/redeem')
            .then(response => response.json())
            .then(data => (this.tokens = data))
    }
});