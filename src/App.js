import React, {Component} from 'react';
import Geocoder from 'react-mapbox-gl-geocoder'
import './App.css';
import {Button, Form, Container, Header, Segment, Grid} from 'semantic-ui-react';

const mapAccess = {
  mapboxApiAccessToken: process.env.REACT_APP_MAPBOX_API_ACCESS_TOKEN
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewport: '',
      viewport2: '',
      fromlat: '',
      fromlon: '',
      tolat: '',
      tolon: '',
      fromlatError: false, // all errors are used for form validation
      fromlonError: false,
      tolatError: false,
      tolonError: false,
      formError: false,
      distance: '',
      distance2: ''
    };
    this.handleFromLatChange = this.handleFromLatChange.bind(this);
    this.handleFromLonChange = this.handleFromLonChange.bind(this);
    this.handleToLatChange = this.handleToLatChange.bind(this);
    this.handleToLonChange = this.handleToLonChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onSelected = this.onSelected.bind(this);
    this.onSelected2 = this.onSelected2.bind(this);
    this.handleCitySubmit = this.handleCitySubmit.bind(this)
  }

  /* fetch distance in kilometers from backend and set it to distance2-state.
  * This method uses mapbox-geocoder and takes latitude and longitude from the object. */
  handleCitySubmit(event) {
    event.preventDefault();

    fetch('http://localhost:3001/api/distance', {
      headers: {
        // 'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({from: {
          lat: this.state.viewport.latitude,
          lon: this.state.viewport.longitude
        },
        to: {
          lat: this.state.viewport2.latitude,
          lon: this.state.viewport2.longitude
        }})
    })
        .then(response => response.json())
        .then(state => this.setState({distance2: state.distance}));
  }

  // sets to the state the city-object that has coordinates for later distance calculations.
  onSelected = (viewport) => {
    this.setState({viewport: viewport});
    // console.log('Selected: ', item)
    console.log(viewport)
  }

  // sets to the state the city-object that has coordinates for later distance calculations.
  onSelected2 = (viewport) => {
    this.setState({viewport2: viewport});
    // console.log('Selected: ', item)
  }

  handleFromLatChange(event) {
  this.setState({fromlat: event.target.value})
  }

  handleFromLonChange(event) {
    this.setState({fromlon: event.target.value})
  }
  handleToLatChange(event) {
    this.setState({tolat: event.target.value})
  }
  handleToLonChange(event) {
    this.setState({tolon: event.target.value})
  }

  handleSubmit(event) {
    event.preventDefault();
    let error = false;


// first replace all commas to dots if there is some
    this.state.fromlat = this.state.fromlat.replace(",", ".")
    this.state.fromlon = this.state.fromlon.replace(",", ".")
    this.state.tolat = this.state.tolat.replace(",", ".")
    this.state.tolon = this.state.tolon.replace(",", ".")

    //then valid all input-fields in form and check that values are between limit
    if(this.state.fromlat === '' || this.state.fromlat < -90 || this.state.fromlat > 90) {
      this.setState({fromlatError: true})
      error = true;
    } else {
      this.setState({fromlatError: false})
    }
    if (this.state.fromlon === '' || this.state.fromlon < -180 || this.state.fromlat > 180) {
      this.setState({fromlonError: true})
      error = true;
    } else {
      this.setState({fromlonError: false})
    }
    if (this.state.tolat === '' || this.state.tolat < -90 || this.state.tolat > 90) {
      this.setState({tolatError: true})
      error = true;
    } else {
      this.setState({tolatError: false})
    }
    if (this.state.tolon === '' || this.state.tolon < -180 || this.state.tolat > 180) {
      this.setState({tolonError: true})
      error = true;
    } else {
      this.setState({tolonError: false})
    }

    if(error) {
      this.setState({formError: true});
      return;
    }

    // fetch distance in kilometers from backend and set it to distance-state.
    fetch('http://localhost:3001/api/distance', {
      headers: {
        // 'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({from: {
        lat: this.state.fromlat,
          lon: this.state.fromlon
        },
      to: {
        lat: this.state.tolat,
        lon: this.state.tolon
      }})
    })
        .then(response => response.json())
        .then(state => this.setState({distance: state.distance}));
  }

  render() {
    const {viewport} = this.state.viewport
    const {viewport2} = this.state.viewport2

    return (
        <div className="App">
          <Container style={{ marginBottom: '60px', marginTop: '60px'}}>
          <Header> You can find distance between two places using either coordinates or city names.</Header>
          </Container>
          <Grid textAlign='center' style={{ height: '70vh' }} verticalAlign='middle'>
            <Form onSubmit={this.handleSubmit}>
              <Segment stacked>
              <Form.Input
                  label='Start point latitude'
                    placeholder='90° - (-90°)'
                    onChange={this.handleFromLatChange}
                    error={this.state.fromlatError}
                />
              <Form.Input
                label='Start point longitude'
                    placeholder='180° - (-180°)'
                    onChange={this.handleFromLonChange}
                    error={this.state.fromlonError}
                />
              <Form.Input
                label='End point latitude'
                 placeholder='90° - (-90°)'
                       onChange={this.handleToLatChange}
                       error={this.state.tolatError}
                />
              <Form.Input
                label='End point longitude'
                 placeholder='180° - (-180°)'
                       onChange={this.handleToLonChange}
                       error={this.state.tolonError}
                />
              <Button type="submit"
              disabled={!this.state.fromlat
              || !this.state.fromlon
              || !this.state.tolat
              || !this.state.tolon}>Submit</Button>
                <p>
                  <Header>Distance:</Header>
                  <p>{this.state.distance} km</p>
                </p>
              </Segment>
            </Form>

          </Grid>
          <Grid textAlign='center' style={{ height: '70vh' }} verticalAlign='middle'>
          <Form onSubmit={this.handleCitySubmit}>
            <Segment stacked>
              <p>City from</p>
              <Geocoder
                  {...mapAccess} onSelected={this.onSelected} viewport={viewport} hideOnSelect={true}
              />
              <p>City to</p>
              <Geocoder
                  {...mapAccess} onSelected={this.onSelected2} viewport={viewport2} hideOnSelect={true}
              />
              <Button type="submit">Submit</Button>
              <p>
                <Header>Distance:</Header>
                <p>{this.state.distance2} km</p>
              </p>
            </Segment>
          </Form>
          </Grid>
        </div>
    );
  }
}

export default App;
