var app = new Vue({
    el: '#user',
    data() {
        return {
            user: [],
            musics: [],
            guildUsers: [] // Added guildUsers array
        };
    },
    created() {
        fetch('/api/dashboard')
            .then(response => response.json())
            .then(data => (this.user = data));

        fetch('/api/music/save')
            .then(response => response.json())
            .then(data => (this.musics = data));

        // Fetch guild user data
        fetch('/api/guild/947967652675072051') // Update the URL to your API endpoint
            .then(response => response.json())
            .then(data => (this.guildUsers = data.members));
    },
    methods: {
        async upgradeLevel(userId, newLevel) {
            try {
                // Send an API request to upgrade the user's level
                const response = await fetch(`/api/upgrade/${userId}/${newLevel}`, {
                    method: 'POST',
                });

                if (response.ok) {
                    // Update the level locally
                    const userIndex = this.guildUsers.findIndex(user => user.id === userId);
                    if (userIndex !== -1) {
                        this.guildUsers[userIndex].level = newLevel;

                        // Sort the users by level in descending order,
                        // and within each level, sort by song counter in descending order
                        this.guildUsers.sort((a, b) => {
                            if (b.level !== a.level) {
                                return b.level - a.level; // Sort by level in descending order
                            }
                            return b.songsCounter - a.songsCounter; // Sort by song counter in descending order
                        });
                    } else {
                        console.error('User not found in the guildUsers array.');
                    }
                }
            } catch (error) {
                console.error(error);
            }
        }
    },
    computed: {
        cardClassByLevel() {
            return level => {
                switch (level) {
                    case 0:
                        return 'card-light-danger';
                    case 1:
                        return 'card-light-blue';
                    case 2:
                        return 'card-dark-blue';
                    case 3:
                        return 'card-tale';
                    case 4:
                        return 'card-tale';
                    default:
                        return ''; // Return default class or adjust as needed
                }
            };
        }
    }
});
