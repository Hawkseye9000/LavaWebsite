var app = new Vue({
    el: '#commands-divs',
    data() {
        return {
            commands: [],
        }
    },
    created() {
        fetch('/api/commands')
            .then(response => response.json())
            .then(data => (this.commands = data.commands))
    }
});