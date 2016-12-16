import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

const propTypes = {
  height: PropTypes.string.isRequired,
  width: PropTypes.string.isRequired,
  fontSize: PropTypes.string.isRequired,
  reverse: PropTypes.bool,
  title: PropTypes.string.isRequired,
  elements: PropTypes.array.isRequired,
  keyMap: PropTypes.func.isRequired,
  renderMap: PropTypes.func.isRequired
};

class Table extends Component {

  constructor() {
    super();

    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.handleMouseOut = this.handleMouseOut.bind(this);

    this.state = {
      hoveredIndex: -1,
      shouldScrollToBottom: false
    };
  }

  componentWillReceiveProps() {
    if(this.props.reverse){
      this.setState({
        shouldScrollToBottom: true
      });
    }
  }

  componentDidUpdate() {
    if(this.state.shouldScrollToBottom){
      this.scrollToBottom();
      this.setState({
        shouldScrollToBottom: false
      });
    }
  }

  handleMouseOver(index) {
    this.setState({
      hoveredIndex: index
    });
  }

  handleMouseOut(index) {
    if(index === this.state.hoveredIndex){
      this.setState({
        hoveredIndex: -1
      });
    }
  }

  scrollToBottom() {
    let node = ReactDOM.findDOMNode(this.scrollView);
    node.scrollTop = node.scrollHeight;
  }

  render() {
    return (
      <table className={'full-width flex-container-column flex-stretch-items'} style={{height: this.props.height, width: this.props.width}}>
        <thead>
          <tr>
            <th>{this.props.title}</th>
          </tr>
        </thead>
        <tbody ref={ref => this.scrollView = ref} className={'full-width full-height scroll-view-y flex-container-column flex-stretch-items'}>
          {
            this.props.elements.map((i, index) => 
              <tr key={this.props.keyMap(i)} style={{fontSize: this.props.fontSize}}>
                <td onMouseOver={() => this.handleMouseOver(index)} onMouseOut={() => this.handleMouseOut(index)}>
                  {this.props.renderMap(i, index, index === this.state.hoveredIndex)}
                </td>
              </tr>
            )
          }
        </tbody>
      </table>
    );
  }
}

Table.propTypes = propTypes;

export default Table;