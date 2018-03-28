const searchUrl = "https://cors-anywhere.herokuapp.com/https://api.deezer.com/search?q="
const trackUrl = "https://cors-anywhere.herokuapp.com/https://api.deezer.com/track/"

Vue.component('search-form', {
    data() {
        return {
            queryString: '',
            searchUrl : searchUrl

        }
    },
    template: `<form @submit.prevent>
        <div class="form-group"><input class="form-control" type="text" name="query" id="query" v-model.lazy="queryString" placeholder="Tapez le nom d'un artiste, d'un album, d'un titre"></div>
        <div class="form-group"><select class="form-control" name="order" id="order">
        <option value="">Trier la recherche par...</option>
        <option value="album">Album</option>
        <option value="artist">Artiste</option>
        <option value="music">Musique</option>
        <option value="trend">Popularité</option>
        <option value="rating">Note</option>
        </select></div>
        <button class="btn btn-block btn-info" type="submit" @click="getAPIResult">Rechercher</button>
    </form>`,
    methods : {
        getAPIResult() {
                const fullSearch = this.searchUrl + this.queryString;
                fetch(fullSearch)
                    .then(data => data.json())
                    .then(data => {
                        this.$parent.queryResult = data.data;
                        this.processResults();
                    });
                // this.search = '';
            },
            processResults() {
                // console.log(this.$parent.queryResult);
            }
        }
    })

Vue.component('navbar', {
    template: `<nav class="nav navbar-inverse">
        <ul class="nav navbar-nav">
            <li><a href="#">Deezweb</a></li>
            <li><a href="index.html">Recherche</a></li>
            <li><a href="favorites.html">Mes Favoris</a></li>
        </ul>
    </nav>`
})

Vue.component('track-item', {
    template: ` <div v-if="track" class="col-xs-12">
                    <div class="col-xs-12 row">
                        <h2>Titre: {{track.title}}</h2>
                    </div>
                    <div class="col-xs-12 row">
                        <div class="col-xs-6">
                            <img :src="track.album.cover_small" alt=""> Album : {{track.album.title}}
                        </div>
                        <div class="col-xs-6">
                            <img :src="track.artist.picture_small" alt=""> Artiste : {{track.artist.name}}
                        </div>
                    </div>
                    <div class="row col-xs-12">
                        <h2>{{track.title}}</h2>
                        <div>Durée: {{track.duration | secToMin}} / Date de parution: {{track.release_date | dateFilter }}</div>
                    </div>
                    <div class="row col-xs-12">
                        <audio controls>
                            <source :src="track.preview" type="audio/mpeg">                
                        </audio>
                    </div>        
                </div>
    `,
    data () {
        return {
            id : document.location.search.split('=')[1],
            track : '',
            artist : '',
            title : ''
        }
    },
    filters : {
        secToMin(int) {
            var minutes = Math.floor(int / 60);
            var seconds = int - minutes * 60;
            return minutes + "m" + seconds + "s"
        },
        dateFilter(date) {
            var formattedDate = new Date(date)
            return formattedDate.toLocaleDateString()
        }
    },
    mounted () {
        
        const fullSearch = trackUrl + this.id;
        console.log(fullSearch)
        fetch(fullSearch)
            .then(data => data.json())
            .then(data => {
                this.track = data;
                
                console.log(this.track)
                // this.processResults();
            });

    }
})

new Vue({
    el : "#app",
    data : {
        msg : "wesh",
        queryResult : ''
    },
    methods : {
        viewAlbum(albumId) {
            console.log(albumId);

        },
        viewArtist(artistId) {
            console.log(artistId);
        },
        listenSong(songId) {
            console.log(songId);
        }
    },
    filters : {
        splitLongText(str) {
            if (str.length > 35) {
                return str.substr(0, 35)
            } else {
                return str
            }

        },
        secToMin(int) {
            var minutes = Math.floor(int / 60);
            var seconds = int - minutes * 60;
            return minutes +"m" + seconds + "s"
        },
        capitalize(str) {
            return str.toUpperCase()
    }
}
});

