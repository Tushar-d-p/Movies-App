import React, { Component } from 'react'
import { getMovies } from './getMovies';
import axios from 'axios';

export default class Movies extends Component {

    constructor() {
        super();
        this.state = {
            movies: [],
            currSearchText:"",
            currPage: 1,
            limit: 4,
            genres: [{_id:"abcd",name: "All Genres"}],
            cGenre: "All Genres"
        }
    }

    async componentDidMount(){
        console.log("Component DID Mount");

        let res = await axios.get("https://backend-react-movie.herokuapp.com/movies");

        let genreRes = await axios.get("https://backend-react-movie.herokuapp.com/genres");

        //console.log(res.data.movies);

        //console.log(genreRes.data.genres);// ek array milega iss array ko hum spread/khol denge setState mein

        this.setState({
            movies: res.data.movies,
            genres: [...this.state.genres,...genreRes.data.genres]
        })
    }
    handleChange=(e)=>{
        let val = e.target.value;
        this.setState({
            currSearchText: val
        })
    }

    limitChange=(e)=>{
        let val = e.target.value;
        console.log(val);

        this.setState({limit:val})
    }
    onDelete=(id)=>{
        let arr = this.state.movies.filter(function(movieObj){
            return movieObj._id !== id;
        })

        this.setState({
            movies: arr
        });
    }
    sortByRatings = (e)=>{
        let className = e.target.className;
        let sortedMovies = [];
        if(className == "fa fa-sort-asc")
        {
            //ascending order
            sortedMovies = this.state.movies.sort(function(moviesObjA,moviesObjB){
                return moviesObjA.dailyRentalRate - moviesObjB.dailyRentalRate
            })
        }
        else {
            //descending order
            sortedMovies = this.state.movies.sort(function(movieObjA,movieObjB){
                return movieObjB.dailyRentalRate - movieObjA.dailyRentalRate
            })
        }
        this.setState({
            movies: sortedMovies
        })
    }

    sortByStocks = (e)=>{
        let className = e.target.className;
        let sortedMovies = [];
        if(className == "fa fa-sort-asc")
        {
            //adcending order
            sortedMovies = this.state.movies.sort(function(moviesObjA,moviesObjB){
                return moviesObjA.numberInStock - moviesObjB.numberInStock
            })
        }
        else {
            //descending order
            sortedMovies = this.state.movies.sort(function(movieObjA,movieObjB){
                return movieObjB.numberInStock - movieObjA.numberInStock
            })
        }
        this.setState({
            movies: sortedMovies
        })
    }

    handlePageChange=(pageNumber)=>{
        this.setState({currPage:pageNumber});
    }

    handlegenresChange=(genre)=>{
        this.setState({
            cGenre: genre
        })
    }
    render() {
        let {movies,currSearchText,currPage,limit,genres,cGenre} = this.state; //ES6 destructuring
        let filteredArr = [];
        if(currSearchText === "")
        {
            filteredArr = movies;
        }
        else {
            filteredArr = movies.filter(function(movieObj){
                let title = movieObj.title.toLowerCase();
                return title.includes(currSearchText.toLowerCase());
            })
        }
        console.log(filteredArr);

        // filtered array pe hum genre ka filter lagaenge
        if(cGenre != "All Genres")
        {
            filteredArr = filteredArr.filter(function(movieObj){
                return movieObj.genre.name == cGenre
            })
            console.log(filteredArr); 
        }
        console.log(filteredArr); 

        // The number of movies whill be divided into how many pages set that
        let numberofPages = Math.ceil(filteredArr.length / limit);
        //numberofPages ek number hai lekin hume pages array ke form mai chaiye isliye array mei convert karenge
        let pageNumberArr = [];
        for(let i = 0; i < numberofPages ; i++)
        {
            pageNumberArr.push(i+1);
        }

        // after the search text has be typed then show the movies by limit
        let si = (currPage-1) * limit;
        let ei = si + limit; // actually it is si + limit - 1 but since in slice we require one extra element we adjusted it here

        filteredArr = filteredArr.slice(si,ei);

        // if(filteredArr.length == 0)
        // {
        //     this.setState({currPage:1})
        // }

        // jab bhi hum HTML tag return karenge tab () mein lekegnge
        // kuch javascript/JSX ka manuplation karenge tab {} mein lekhnge
        return (
            //JSX

            <>
            {   this.state.movies.length == 0 ?

                <div className="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span></div>
                :
                <div className="container">
                    <div className="row">
                        <div className="col-3">
                            <ul className="list-group">
                                {
                                    genres.map((genreObj)=>(
                                        <li onClick={()=>this.handlegenresChange(genreObj.name)} key={genreObj._id} className="list-group-item">
                                            {genreObj.name}
                                        </li>
                                    ))
                                }
                            </ul>
                            <h5>Current Genre : {cGenre}</h5>
                        </div>
                        <div className="col-9">
                            
                            <input type="search" value={this.state.currSearchText} onChange={this.handleChange}></input>
                            <input type="number" value ={this.state.limit} onChange={this.limitChange}></input>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Tile</th>
                                        <th scope="col">Genre</th>
                                        <th scope="col">
                                            <i onClick={this.sortByStocks} className="fa fa-sort-asc" aria-hidden="true"></i>
                                            Stock
                                            <i onClick={this.sortByStocks} className="fa fa-sort-desc" aria-hidden="true"></i>
                                        </th>
                                        <th scope="col">
                                            <i onClick={this.sortByRatings} className="fa fa-sort-asc" aria-hidden="true"></i>
                                            Rate
                                            <i onClick={this.sortByRatings} className="fa fa-sort-desc" aria-hidden="true"></i>
                                        </th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        filteredArr.map((movieObj)=>{
                                            return(
                                                <tr scope="row" key={movieObj._id}>
                                                    <td></td>
                                                    <td>{movieObj.title}</td>
                                                    <td>{movieObj.genre.name}</td>
                                                    <td>{movieObj.numberInStock}</td>
                                                    <td>{movieObj.dailyRentalRate}</td>
                                                    <td><button onClick={()=>{
                                                        this.onDelete(movieObj._id)
                                                    }} type="button" class="btn btn-danger">Delete</button></td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                            <nav aria-label="...">
                                <ul className="pagination">
                                    {
                                        // PageNumberArr se ek ek pageNumber nikalenge uspar styling lagake display kar denge
                                        pageNumberArr.map((pageNumber)=>{
                                            let classStyle = pageNumber == currPage ? "page-item active":"page-item";

                                            return(
                                                <li key={pageNumber} onClick={()=>this.handlePageChange(pageNumber)} className={classStyle}><span className="page-link">{pageNumber}</span></li>
                                            )
                                        })
                                    }
                                </ul>
                            </nav>

                        </div>
                    </div>
                </div>
            }
            </>
        )
    }
}
