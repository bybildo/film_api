import React from 'react'
import './App.css'
import Film from './Film'
import axios from 'axios'

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      films: [],
      search: ''
    }
  }

  componentDidMount() {
    this.fetchData('https://api.themoviedb.org/3/movie/popular?language=uk-UA&page=1');
  }

  fetchData(url) {
    const options = {
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjNDFlZDJjODNmODY3ZWU5MjAwNjhmYWU2ZGQ3MmUxYSIsIm5iZiI6MTc1MDIzNDc5Mi40ODEsInN1YiI6IjY4NTI3NmE4OGUwMjhhNDFjYjA2NjEwZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.7mY1s3N3i-MFg8q7lk2wn6iAHNwwbPuL7USHJ6yw0eA'
      }
    };

    axios.get(url, options)
      .then(response => {
        this.setState({ films: response.data.results });
      })
      .catch(error => {
        console.error(error);
      });
  }

  buttonSumbit = (event) => {
    event.preventDefault();
    if (this.state.search.trim() === '') {
      this.fetchData(`https://api.themoviedb.org/3/movie/popular?language=uk-UA&page=1`);
    }
    else {
      this.fetchData(`https://api.themoviedb.org/3/search/movie?query=${this.state.search}&page=1&language=uk-UA`);
    }
  }

  handleInputChange = (event) => {
    this.setState({ search: event.target.value });
  }

  render() {
    return (
      <div>
        <div className='searchArea'>
          <form target='' onSubmit={this.buttonSumbit}>
            <input type="text" placeholder='Введіть назву фільму' value={this.state.search} onChange={this.handleInputChange} />
            <button type="submit">Пошук</button>
          </form>
        </div>
        <div className='filmList'>
          {this.state.films.filter(film => film.vote_average > 0 && film.poster_path != null).sort((a, b) => (b.popularity * b.vote_average) - (a.popularity * a.vote_average)).map((film) => <Film key={film.id} film={film} />)}
        </div>
      </div>
    ) 
  }

}

export default App
