import React, { Component } from 'react';
import axios from 'axios';
import PhotoList from './PhotoList.js';
import NoResults from './NoResults.js';
import Loading from './Flickr.svg';

// Build your app components according to the provided mockup.
// Most components should be stateless functional components that focus on the UI rather than behavior.You’ll need:

// A container component that takes in a keyword and api key as props, 
// and fetches the photos and other required information from the API

class Results extends Component {

    constructor() {
        super();
        //Lets us use the keyword this inside the constructor within the context of the App
        //class rather than the parent component class we're extending from React.
        //So now in the constructor, we can write this.state and set it equal to an object.
        //Now the state in our app is going to be the photo data we want to display.
        this.state = {
            keyword: '',
            photos: [],
            noResults: false,
            loading: true
        }
    }

    // Fetch the data from Flickr API.
    // Make sure data fetching and state is managed by a higher- level “container” component.

    componentDidMount() {
        if (this.props.query !== "") {
            axios.get(`https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${this.props.api}&tags=${this.props.query}&per_page=32&format=json&nojsoncallback=1`)
                .then(response => {
                    this.setState({
                        keyword: this.props.query,
                        photos: response.data.photos.photo,
                        loading: false
                    })
                })
                .catch(error => {
                    console.log('Error fetching and parsing data', error);
                });
        }
        if (this.props.query === "") {
            axios.get(`https://api.flickr.com/services/rest/?method=flickr.photos.getRecent&api_key=${this.props.api}&tags=${this.props.query}&per_page=16&format=json&nojsoncallback=1`)
                .then(response => {
                    this.setState({
                        keyword: this.props.query,
                        photos: response.data.photos.photo,
                        loading: false
                    })
                })
                .catch(error => {
                    console.log('Error fetching and parsing data', error);
                });
        }
    }
    componentWillReceiveProps(newProps) {
        this.setState({ keyword: newProps.query });
        this.performSearch(newProps.query);
    }

    // Fetch the data from Flickr API.
    // Make sure data fetching and state is managed by a higher- level “container” component.

    performSearch = (query) => {
        axios.get(`https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${this.props.api}&tags=${query}&per_page=16&format=json&nojsoncallback=1`)
            .then(response => {
                this.setState({
                    photos: response.data.photos.photo,
                    loading: false
                });
            })
            .catch(error => {
                console.log('Error fetching and parsing data', error);
            });
    }

    render() {

        //Add a loading indicator that displays each time the app fetches new data.

        if (this.state.loading === true && this.props.query !=='') {
            return (
                <div>
                    <img src={Loading} alt="Loading Results" />
                </div>
            );

            } else {

                // Include a 404-like error route that displays when a URL path does not match a route.

            if (this.state.photos.length === 0 && this.state.keyword !== '') {
                return (<NoResults />);
            } else {
                return (
                    <PhotoList photos={this.state.photos} query={this.state.keyword} />
                );
            }
        }
        


        
    }
}

export default Results;