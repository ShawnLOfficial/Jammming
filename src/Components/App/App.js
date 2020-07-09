import React from 'react';
import logo from '../../../src/favicon.ico';
import './App.css';
import { SearchBar } from "../SearchBar/SearchBar.js";
import { SearchResults } from "../SearchResults/SearchResults.js";
import { Playlist } from "../Playlist/Playlist.js";
import { Spoty } from "../../util/Spotify.js";

//2:07:12

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName: 'My Playlist',
      playlistTracks: []
    }
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.searchs = this.searchs.bind(this);
  }

  //this might need 57:13 because this might not update playlistTracks state might need another
  //  variable to store state and setState to set it.
  addTrack(track) {
    if (this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      return ;
    }
    this.state.playlistTracks.push(track);
  }

  removeTrack(track) {
    let newTrack = this.state.playlistTracks.filter((currentTrack) => currentTrack.id !== track.id)
    this.setState({ playlistTracks: newTrack });
  }

  updatePlaylistName(name) {
    this.setState({ playlistName: name });
  }

  savePlaylist() {
    const trackURIs = this.state.playlistTracks.map(track => track.uri);
    Spoty.savePlaylist(this.state.playlistName, trackURIs).then( () => {
      this.setState({ 
        playlistName: 'New Playlist',
        playlistTracks: [] })
      });
  }

  searchs(term) {
    Spoty.search(term).then(result => this.setState({ searchResults: result }));
  }

  render() {
    return (
    <div>
      <h1>Ja<span className="highlight">mmm</span>ing</h1>
      <div className="App">
        <SearchBar onSearch={this.searchs} />
        <div className="App-playlist">
          <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
          <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} 
          onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist} />
        </div>
      </div>
    </div>)
  };
}

export default App;
