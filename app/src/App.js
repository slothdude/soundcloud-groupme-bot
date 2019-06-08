import React from 'react';
import logo from './logo.svg';
import './App.css';
const axios = require('axios');

const listOfLinks = [...new Array(100)].map(ele => Math.random().toString(36));

class App extends React.Component {

  constructor(props){
    super(props);
    this.state = {listOfPosts: []};
  }

  componentDidMount = () => {
    axios.get('/posts')
      .then((response) => {
        console.log(response.data);
        this.setState({listOfPosts: response.data});
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .finally(function () {
        // always executed
      });
  }

  render = () => (
    <div className="App">
      <div class="card header">
        <div class="card-body">
          <h5 class="card-title">Welcome Fam</h5>
          <a href="https://open.spotify.com/playlist/7tlQqoMHmOjSzeHhtt0qwn?si=JRRtCL2MQIC1DfCsZmT2IQ" class="btn btn-success">Spotify Playlist</a>
        </div>
      </div>
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Soundcloud Posts</h5>
          <table class="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Date Posted</th>
                <th scope="col">Link</th>
                <th scope="col">Creds</th>
              </tr>
            </thead>
            <tbody>
              {this.state.listOfPosts.map((post, index) =>
                <tr>
                  <th scope="row">{index+1}</th>
                  <td>
                    {post.date_added}
                  </td>
                  <td>
                    {post.link}
                  </td>
                  <td>
                    {post.name}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <a href="#" class="btn btn-primary">Go somewhere</a>
        </div>
      </div>
    </div>
  );
}

export default App;
