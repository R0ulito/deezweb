const searchUrl = "https://cors-anywhere.herokuapp.com/https://api.deezer.com/search?q="
const trackUrl = "https://cors-anywhere.herokuapp.com/https://api.deezer.com/track/"
const albumUrl = "https://cors-anywhere.herokuapp.com/https://api.deezer.com/album/"
const artistUrl = "https://cors-anywhere.herokuapp.com/https://api.deezer.com/artist/"

Vue.component('search-form', {
    data() {
        return {
            queryString: '',
            queryOrder : '',
            searchUrl: searchUrl,
            loading: false

        }
    },
    template: `<form @submit.prevent class="row">
                    <div class="form-group">
                        <input class="form-control" type="text" name="query" id="query" v-model.lazy="queryString" placeholder="Tapez le nom d'un artiste, d'un album, d'un titre">
                    </div>
                    <div class="form-group">
                        <select class="form-control" name="order" id="order" v-model="queryOrder">
                            <option value="">Trier la recherche par...</option>
                            <option value="&order=ALBUM_ASC">Album</option>
                            <option value="&order=ARTIST_ASC">Artiste</option>
                            <option value="&order=TRACK_ASC">Musique</option>
                            <option value="&order=RATING_ASC">Popularité</option>
                            <option value="&order=RANKING">Note</option>
                        </select>
                    </div>
                    <button class="btn btn-block btn-info" type="submit" @click="getAPIResult">Rechercher</button>
               </form>`,
    methods : {
        getAPIResult() {
            this.$parent.queryResult = '';
            console.log(this.queryOrder);
            var form = document.querySelector('form');
            var group = document.querySelector('.result-group');
            if(group === true) {
                group.style.display = "none";
            }
            form.insertAdjacentHTML('afterend', '<div style="margin-top: 25vh" class="loader"</div>');
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
                var group = document.querySelector('.result-group');
                console.log(group);
                document.querySelector('.loader').remove();
                if(group !== null) {
                    group.style.display = "block";
                }
            }
        },
    mounted() {
        document.querySelector('.loader').style.display = "none";
    }
    })

Vue.component('navbar', {
    template: `<div class="row">
                   <header class="col-xs-12 text-center padding0"><img class="img-responsive" src="assets/img/deezweb_banner.png" alt=""></header>   
                   <nav class="nav navbar-inverse navbar-fixed-top">
                        <div class="navbar-header">
                        <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span> 
                        </button>
                            <a class="navbar-brand" href="https://github.com/r0ulito/deezweb">Deezweb</a>
                        </div>
                        <div class="collapse navbar-collapse" id="myNavbar">
                            <ul class="nav navbar-nav">
                                <li></li>
                                <li><a href="index.html">Recherche</a></li>
                                <li><a href="favorites.html">Mes Favoris</a></li>
                            </ul>
                        </div>
                   </nav>
               </div>`
})

Vue.component('track-item', {
    props : ["data-id"],
    template: `<div>
                    
                    <div v-if="track" class="col-xs-12">
                        <div class="col-xs-12 row text-center">
                            <h2>{{track.title}}</h2>
                        </div>
                        <div class="col-xs-12 row">
                            <div class="col-xs-6">
                                <img class="img-responsive" :src="track.album.cover_big" alt=""><h3> Album : <a :href="'album.html?id=' + track.album.id">{{track.album.title}}</a></h3>
                            </div>
                            <div class="col-xs-6">
                                <img class="img-responsive" :src="track.artist.picture_big" alt=""><h3><a :href="'artist.html?id=' + track.artist.id">{{track.artist.name}}</a></h3>
                            </div>
                        </div>
                      
                        <div class="row col-xs-12 mt50">
                            <h5>{{track.title}}</h5>
                            <div>Durée: {{track.duration | secToMin}} / Date de parution: {{track.release_date | dateFilter }}</div>
                        </div>
                        <div class="row col-xs-12 mt50">
                            <audio class="col-xs-12" controls>
                                <source :src="track.preview" type="audio/mpeg">                
                            </audio>
                        </div>
                        <div class="row col-xs-12 mt50 mb50">
                            <a :href="track.link"><button class="col-xs-3 btn btn-primary">Voir le titre sur Deezer</button></a>
                            <button v-if="ids.indexOf(track.id) === -1" @click="addToFavorites(track.id, track.artist.name, track.title, track.album.title)" class=" col-xs-3 col-xs-offset-6 btn btn-danger">Ajouter aux favoris</button>                           
                            <button v-else @click="removeFromFavorites(track.id)" class=" col-xs-3 col-xs-offset-6 btn btn-danger">Retirer des favoris</button>
                        </div>        
                    </div>
                    <div v-else>
                        {{error}}
                        <div class="loader"></div>
                    </div>
               </div>
    `,
    data () {
        return {
            id : document.location.search.split('=')[1],
            track : '',
            artist : '',
            title : '',
            ids : null,
            error : ''
        }
    },
    methods : {
        addToFavorites(id, artist, title, album) {
            this.ids.push(id);
            this.$emit('addfav', id, artist, title, album);
        },
        removeFromFavorites(id) {
            var index = this.ids.indexOf(id);
            this.ids.splice(index,1);
            this.$emit('removefav', id);
        }
    },
    filters : {
        secToMin(int) {
            var minutes = Math.floor(int / 60);
            var seconds = int - minutes * 60;
            seconds < 10 ? seconds = "0" + seconds : seconds = seconds;
            if (minutes === 0) {
                return seconds + "s";
            }
            return minutes + ":" + seconds
        },
        dateFilter(date) {
            var formattedDate = new Date(date)
            return formattedDate.toLocaleDateString()
        }
    },
    mounted : function() {
        if (document.location.search.indexOf('?id=') >= 0 && document.location.search.split('=')[1].length > 0 && isNaN(document.location.search.split('=')[1]) === false) {
            const fullSearch = trackUrl + this.id;
            console.log(fullSearch)
            fetch(fullSearch)
                .then(data => data.json())
                .then(data => {
                    this.track = data;

                    console.log(this.track)

                });
        } else {
            document.querySelector('.loader').style.display = "none";
            this.error = 'La page demandée ne peut pas s\'afficher: un idendifiant est attendu'
        }
        // document.querySelector('.loader').classList.add('hidden');

    },
    created : function () {
        this.ids = JSON.parse(localStorage.getItem('ids')) || [];
    }
});

Vue.component('album-item', {
    template : `<div>
                    <div v-if="album">
                        <div class="col-xs-12 row">
                            <h2>Album: {{album.title}}</h2>
                        </div>
                        <div class="col-xs-12 row">
                            <h4>Artiste: <a :href="'artist.html?id=' + album.artist.id">{{album.artist.name}}</a></h4>
                        </div>
                        <div class="col-xs-12 row">
                            <div class="col-xs-12 col-md-4">
                                <img class="img-responsive" :src="album.cover_xl"/>
                                <img v-if="album.explicit_lyrics" class="img-responsive" src="../assets/img/explicit.png" alt="">
                                <a :href="album.link"><button class="btn btn-primary">Voir l'album sur Deezer</button></a>
                            </div>
                            <div class="col-xs-12 col-md-8 mt50">
                                <table class="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Titre</th>
                                            <th>Durée</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr @click="goTotrack(track.id)" v-for="track, index in album.tracks.data">
                                            <th scope="row">{{index +1}}</th>
                                            <td>{{track.title}}</td>
                                            <td>{{track.duration | secToMin}}</td>
                                        </tr>

                                    </tbody>
                                </table>
                            </div>
                        </div>               
                    </div>
                    <div v-else>
                        <div class="loader"></div>
                        {{error}}
                    </div>                    
                </div>`,
    data() {
        return {
            id : document.location.search.split('=')[1],
            album : '',
            error : ''
        }
    },
    mounted() {
        if (document.location.search.indexOf('?id=') >= 0 && document.location.search.split('=')[1].length > 0 && isNaN(document.location.search.split('=')[1]) === false) {
            console.log(this.id);
            const fullSearch = albumUrl + this.id;
            console.log(fullSearch)
            fetch(fullSearch)
                .then(data => data.json())
                .then(data => {
                    this.album = data;

                    console.log(this.album)

                });
        } else {
            document.querySelector(".loader").style.display = "none"
            this.error = `La page demandée ne peut pas s\'afficher: un idendifiant est attendu`
        }


    },
    filters : {
        secToMin(int) {
            var minutes = Math.floor(int / 60);
            var seconds = int - minutes * 60;
            seconds < 10 ? seconds = "0" + seconds : seconds = seconds;
            if (minutes === 0) {
                return seconds + "s";
            }
            return minutes + ":" + seconds
        }
    },
    methods : {
        goTotrack(id) {
            document.location.href = "track.html?id=" + id;
            // console.log(id);
        }
    }
});

Vue.component('artist-item', {
    template: `<div>
                    <div v-if="artist" class="text-center">
                        <h2 class="text-center">{{artist.name}}</h2>
                        <img :src="artist.picture_big" class="img-responsive center-block" alt="">
                        <h4>Nombre d'albums: {{artist.nb_album}}</h4>
                        <h4>Nombre de fans: {{artist.nb_fan | fanFilter}}</h4>
                        <a :href="artist.link"><button class="col-xs-4 col-xs-offset-4 btn btn-primary">Voir l'artiste sur Deezer</button></a>
                                        
                    </div>
                    <div v-else>
                    {{error}}
                        <div class="loader"></div>
                    </div>
                   

               </div>`,
    data() {
        return {
            id : document.location.search.split('=')[1],
            artist : '',
            error : ''
        }
    },
    filters : {
        fanFilter(int) {
            if(int > 1000000) {
                var text = parseFloat(int / 1000000).toString().substr(0,4).replace(/\./g, ',') + "M";
                return text
            }
            return int
        }
    },
    mounted() {
        if (document.location.search.indexOf('?id=') >= 0 && document.location.search.split('=')[1].length > 0 && isNaN(document.location.search.split('=')[1]) === false) {
            const fullSearch = trackUrl + this.id;
            console.log(fullSearch)
            fetch(fullSearch)
                .then(data => data.json())
                .then(data => {
                    this.track = data;

                    console.log(this.track)

                });
        } else {
            document.querySelector('.loader').style.display = "none";
            this.error = 'La page demandée ne peut pas s\'afficher: un idendifiant est attendu'
        }

    }
});

Vue.component('favorite-item', {
    props: ["id", "artist", "title", "album"],
    template : `<div >                   
                    <div class="favorite-item">
                        <i class="pull-left favorite-item-heart fas fa-heart"></i>
                        <span class="col-xs-6" @click="showTrack(id)">{{title}}  ({{artist}} / {{album}})</span>
                    <i @click="removeFromFavorites(id)" class="favorite-item-trash fas fa-trash-alt" title="Enlever des favoris"></i>                      
                    </div>
                </div>`,
    data() {
        return {
            ids : null,

        }
    },
    methods : {
      showTrack(id) {
          console.log(id);
          location.href = "track.html?id=" + id;
      },
        removeFromFavorites(id) {
            var index = this.ids.indexOf(id);
            this.ids.splice(index,1);
            this.$emit('removefav', id);
        }
    },
    created: function() {
        this.ids = JSON.parse(localStorage.getItem("ids"))  || []
    }
})

new Vue({
    el : "#app",
    data : {
        favorites : [],
        newFav : {
            id : '',
            artist : '',
            title : '',
            album : ''
        },
        queryResult : '',
        ids : []
    },
    computed : {

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
        },
        addFav(id, artist, title, album) {
            console.log(artist, title)
            this.newFav.id = id;
            this.newFav.artist = artist;
            this.newFav.title = title;
            this.newFav.album = album;
            if (localStorage["favorites"]) {
                console.log("key exists")
                var favLength = JSON.parse(localStorage["favorites"]).length
                var favorites = JSON.parse(localStorage["favorites"]);
                var favIdLength = JSON.parse(localStorage['ids']).length;
                var favIds = JSON.parse(localStorage['ids']);

                console.log(favorites)
                for (var i = 0; i < favIdLength; i += 1) {
                    if (favIds[i] === id) {
                        return
                    }
                }

                for (var i = 0; i < favLength; i += 1) {
                    if (favorites[i]['id'] === id) {
                        return
                    }
                }
                this.favorites.push(this.newFav);
            } else {
                console.log("key does not exist")
                this.favorites.push(this.newFav);
            }
            this.ids.push(id);
            localStorage.setItem('ids', JSON.stringify(this.ids));
            localStorage.setItem("favorites", JSON.stringify(this.favorites));
            this.newFav = {
                id : '',
                artist : '',
                title : '',
                album : ''
            };
            // console.log(localStorage["favorites"]);

        },
        removeFav(id) {
            favIdLength = localStorage["ids"].length;
            favorites = JSON.parse(localStorage["favorites"]);
            var idIndex = this.ids.indexOf(id);
            var favIndex;
            for (var i = 0; i < favorites.length; i += 1) {
                if(favorites[i]['id'] === id) {
                    favIndex = i;
                }
            }
            this.favorites.splice(favIndex, 1)
            this.ids.splice(idIndex, 1);
            localStorage.setItem("ids", JSON.stringify(this.ids));
            localStorage.setItem('favorites', JSON.stringify(this.favorites));
            // console.log(localStorage["ids"]);
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
            seconds < 10 ? seconds = "0" + seconds : seconds = seconds;
            if (minutes === 0) {
                return seconds + "s";
            }
            return minutes + ":" + seconds
        },
        capitalize(str) {
            return str.toUpperCase()
    }
},
    created: function() {
        this.favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        this.ids = JSON.parse(localStorage.getItem('ids')) || [];
    }
});

