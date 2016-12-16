import React, { Component, PropTypes } from 'react';

import Table from '../component/Table';

const propTypes = {
  height: PropTypes.string.isRequired,
  width: PropTypes.string.isRequired,
  fontSize: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  elements: PropTypes.array.isRequired,
  keyMap: PropTypes.func.isRequired,
  renderMap: PropTypes.func.isRequired,
  onSend: PropTypes.func.isRequired
}

const style = {
  chatInput: {
    padding: '4px',
    fontSize: '110%'
  },
  chatSend: {
    fontSize: '100%'
  }
}

class Chat extends Component {
  constructor() {
    super();

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSend = this.handleSend.bind(this);

    this.state = {
      input: ''
    };
  }

  handleInputChange(e) {
    this.setState({
      input: e.target.value
    });
  }

  handleSend(e) {
    e.preventDefault();

    const inputString = this.state.input.trim();
    if(inputString.length > 0){
      this.props.onSend(inputString);
      this.setState({
        input: ''
      });
    }
  }

  render() {
    return (
      <div className={'flex-container-column'} style={{width: this.props.width}}>
        <Table
          height={this.props.height}
          width={'100%'}
          fontSize={this.props.fontSize}
          reverse
          title={this.props.title}
          elements={this.props.elements}
          keyMap={this.props.keyMap}
          renderMap={(i, index, isHovered) => 
            <div style={{width: this.props.width}}>
              {this.props.renderMap(i, index)}
            </div>
          }
        />
        <form className={'full-width flex-container-row flex-space-between'} onSubmit={this.handleSend}>
          <input
            className={'full-width'}
            style={style.chatInput}
            type="text"
            value={this.state.input}
            placeholder="Input a message"
            onChange={this.handleInputChange}
          />
          <input style={style.chatSend} type="submit" value="Send" />
        </form>
      </div>
    );
  }
}

Chat.propTypes = propTypes;

export default Chat;