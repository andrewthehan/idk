import React, { Component } from 'react';

const style = {
  content: {
    width: '40%'
  }
}

class Help extends Component {
  render() {
    return (
      <div className={'flex-container-column flex-center'}>
        <p className={'gap'} style={style.content}>
          You've encountered an error! Please submit an <a href="https://github.com/andrewthehan/idk/issues">issue</a>.
        </p>
      </div>
    )
  }
}

export default Help;