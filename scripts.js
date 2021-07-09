window.addEventListener("load", LoadPage);

// Click this to change how many movies appear
var moviesAmt = 3;

// Runs after page is loaded
function LoadPage(){
    // Vue Component for the movies
    Vue.component('productdisplay', {
        template: 
        `<div class="card">
            <img v-bind:src=poster class="card-img-top">
            <div class="card-body">
                <h1 class="card-title">{{ title }}</h1>
                <p class="text">{{ overview }}</p>
                <button class="btn btn-primary" v-on:click=addTicket(0)>AdultTicket <span class="badge badge-light">{{cartInfo.adultTicket}}</span></button>
                <button class="btn btn-primary" v-on:click=addTicket(1)>ChildTicket <span class="badge badge-light">{{cartInfo.childTicket}}</span></button>
            </div>
        </div>`,
        //Grabs information of a certain movie from the vue instance app and stores info in props
        props: ['title', 'poster', 'overview'],
        methods:
        {
            //Adds ticket when ran, 0 is adult tickets and 1 is children tickets
            addTicket(value){
                if (value == 0){
                    this.cartInfo.adultTicket++;
                    this.$emit('updatetotaltickets', 0)
                }
                else if (value == 1){
                    this.cartInfo.childTicket++;
                    this.$emit('updatetotaltickets', 1)
                }
                //sends object to vue instance app
                this.$emit('updatecart', this.cartInfo)
            }
        },
        data: function(){
            return{
                // Stores data into array ready to be sent to vue app instance
                cartInfo:{ movieTitle: this.title, adultTicket: 0, childTicket: 0}
            }
        }
    });

    const vue = new Vue({
        el: "#app",
        data:{
            // movies is where the movie obj are stored from the api call 
            movies: [],
            // cartObject is where the arrays from the productdisplay vue component are stored
            cartObjects: [],
            childPrice: 3.99,
            adultPrice: 6.99,
            totalAdult: 0,
            totalChild: 0, 
            showCart: false
        },
        methods:{
            //Updates cartObject with array from productdisplay vue component
            UpdateCart(obj)
            {
                if (this.cartObjects == "")
                {
                    this.cartObjects.push(obj);

                }
                else
                {
                    for(let i = 0; i < this.cartObjects.length; i++)
                    {
                        if (this.cartObjects[i].movieTitle == obj.movieTitle){
                            return;
                        }
                    }
                    this.cartObjects.push(obj);  
                }
            },
            //Makes ticket summary output possible
            CheckOut(){
                this.showCart = true;
            },
            //Subtracts tickets from deleted row, the indexed obj in cartObject is not deleted
            Delete(obj){
                this.totalAdult -= obj.adultTicket;
                this.totalChild -= obj.childTicket;
                obj.childTicket = 0;
                obj.adultTicket = 0;
            },
            // Subtracts a ticket based on 1 or 0. 1 are child tickets and 1 are adult tickets
            SubtractTicket(obj, value){
               switch(value){
                   case 0:
                       obj.adultTicket--;
                       this.totalAdult--;
                       break;
                    case 1:
                        obj.childTicket--;
                        this.totalChild--;
                        break;
               }
            },
            // Adds tickets based on the 1 and 0 system again
            UpdateTotalTickets(value){
                switch(value){
                    case 0:
                        this.totalAdult++;
                        break;
                     case 1:
                        this.totalChild++;
                        break;
                }
            }
        },
        mounted(){
            //The API call
            axios.get("https://api.themoviedb.org/3/movie/now_playing?api_key=5c121df8e93b22adde3c392246600b79&language=en-US&page=1")
            .then ((response) =>
            {
                if(response.status = 200){
                    recentMovies = [];
                    for(let i = 0; i < moviesAmt; i++){
                        response.data.results[i].poster_path = "https://image.tmdb.org/t/p/w500" + response.data.results[i].poster_path;
                        recentMovies.push(response.data.results[i]);
                    }
                    this.movies = recentMovies; 
                }
                else{
                    alert("Did not grab data, reload page");
                }
            });
        }
    });
}