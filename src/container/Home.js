import React, { Component } from 'react';

const style = {
  content: {
    width: '40%'
  }
}

class Home extends Component {
  render() {
    return (
      <div className={'flex-container-column flex-center'}>
        <p className={'gap'} style={style.content}>
          <span className={'accent'}>idk</span> is a decider.
        </p>
      </div>
    );
  }
}

export default Home;