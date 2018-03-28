const searchUrl = "https://cors-anywhere.herokuapp.com/https://api.deezer.com/search?q="
const trackUrl = "https://cors-anywhere.herokuapp.com/https://api.deezer.com/track/"
const albumUrl = "https://cors-anywhere.herokuapp.com/https://api.deezer.com/album/"
const artistUrl = "https://cors-anywhere.herokuapp.com/https://api.deezer.com/artist/"

Vue.component('search-form', {
    data() {
        return {
            queryString: '',
            queryOrder : '',
            searchUrl : searchUrl

        }
    },
    template: `<form @submit.prevent>
                    <div class="form-group">
                        <input class="form-control" type="text" name="query" id="query" v-model.lazy="queryString" placeholder="Tapez le nom d'un artiste, d'un album, d'un titre">
                    </div>
                    <div class="form-group">
                        <select class="form-control" name="order" id="order" v-model="queryOrder">
                            <option value="">Trier la recherche par...</option>
                            <option value="&order​=ALBUM_ASC">Album</option>
                            <option value="&​order​=ARTIST_ASC">Artiste</option>
                            <option value="&​order​=TRACK_ASC">Musique</option>
                            <option value="&​order​=RATING_ASC">Popularité</option>
                            <option value="&order​=RANKING">Note</option>
                        </select>
                    </div>
                    <button class="btn btn-block btn-info" type="submit" @click="getAPIResult">Rechercher</button>
               </form>`,
    methods : {
        getAPIResult() {
            console.log(this.queryOrder)
            // document.querySelector('.loader').style.display = "block";
                const fullSearch = this.searchUrl + this.queryString + this.queryOrder;
            console.log(fullSearch)
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
        },
    mounted() {
        document.querySelector('.loader').style.display = "none";
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
    template: `<div>
                    
                    <div v-if="track" class="col-xs-12">
                        <div class="col-xs-12 row">
                            <h2>Titre: {{track.title}}</h2>
                        </div>
                        <div class="col-xs-12 row">
                            <div class="col-xs-6">
                                <img :src="track.album.cover_small" alt=""> Album : <a :href="'album.html?id=' + track.album.id">{{track.album.title}}</a>
                            </div>
                            <div class="col-xs-6">
                                <img :src="track.artist.picture_small" alt=""> Artiste : <a :href="'artist.html?id=' + track.artist.id">{{track.artist.name}}</a>
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
                    <div v-else>
                        <div class="loader"></div>
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

            });
        // document.querySelector('.loader').classList.add('hidden');

    }
});

Vue.component('album-item', {
    template : `<div>
                    <div v-if="album">
                    {{album}}
                    </div>
                    <div v-else>
                        <div class="loader"></div>
                    </div>                    
                </div>`,
    data() {
        return {
            id : document.location.search.split('=')[1],
            album : ''
        }
    },
    mounted() {
        const fullSearch = albumUrl + this.id;
        console.log(fullSearch)
        fetch(fullSearch)
            .then(data => data.json())
            .then(data => {
                this.album = data;

                console.log(this.track)

            });

    }
});

Vue.component('artist-item', {
    template: `<div>
                <div v-if="artist">
                {{artist}}
                </div>
                <div v-else>
                    <div class="loader"></div>
                </div>
                   

               </div>`,
    data() {
        return {
            id : document.location.search.split('=')[1],
            artist : ''
        }
    },
    mounted() {
        const fullSearch = artistUrl + this.id;
        console.log(fullSearch)
        fetch(fullSearch)
            .then(data => data.json())
            .then(data => {
                this.artist = data;

                console.log(this.artist)

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

