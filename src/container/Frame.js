import React, { Component } from 'react';
import { Link } from 'react-router';

const style = {
  links: {
    width: '40%'
  }
}

class Frame extends Component {
  render() {
    return (
      <div className={'flex-container-column'}>
        <div className={'scroll-view-y flex-fill full-width'}>
          {this.props.children}
        </div>
        <div className={'flex-container-row flex-space-around'} style={style.links}>
          <Link to={'/idk'}>Home</Link>
          <Link to={'/idk/about'}>About</Link>
          <a href="https://github.com/andrewthehan/idk" target="_blank">Github</a>
        </div>
      </div>
    )
  }
}

export default Frame;