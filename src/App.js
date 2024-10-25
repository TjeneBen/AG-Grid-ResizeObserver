import React, { Component } from 'react';
import Grid from './Grid';

export class App extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <React.Fragment>
        <Grid />
      </React.Fragment>     
    );
  }
}

export default App;
