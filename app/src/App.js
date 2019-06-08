import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {

  const listOfLinks = [...new Array(100)].map(ele => Math.random().toString(36));

  return (
    <div className="App">
      <div class="card header">
        <div class="card-body">
          <h5 class="card-title">Welcome Fam</h5>
          <a href="#" class="btn btn-success">Spotify Playlist</a>
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
              {listOfLinks.map((url, index) =>
                <tr>
                  <th scope="row">{index+1}</th>
                  <td>
                    {url}
                  </td>
                  <td>
                    {url}
                  </td>
                  <td>
                    {url}
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
