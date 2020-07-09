import React from 'react';
import './SearchBar.css';

export class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            term: ''
        };
        this.searchit = this.searchit.bind(this);
        this.handleTermChange = this.handleTermChange.bind(this);
    }

    searchit() {
        this.props.onSearch(this.state.term);
    }

    handleTermChange(event) {
        this.setState({ term: event.target.value });
    }

    render() {
        return (
            <div className="SearchBar">
                <input placeholder="Enter A Song, Album, or Artist" onChange={this.handleTermChange} />
                <button className="SearchButton" onClick={this.searchit}>SEARCH</button>
            </div>
        )
    }
}