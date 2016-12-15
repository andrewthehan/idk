import React, { Component, PropTypes } from 'react';

const propTypes = {
  height: PropTypes.string.isRequired,
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
      hoveredIndex: -1
    };
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

  render() {
    return (
      <table className={'full-width'} style={{}}>
        <thead>
          <tr>
            <th>{this.props.title}</th>
          </tr>
        </thead>
        <tbody className={'scroll-view-y flex-container-column flex-stretch-items ' + (this.props.reverse ? 'flex-end' : '')} style={{height: this.props.height}}>
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