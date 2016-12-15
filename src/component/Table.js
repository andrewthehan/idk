import React, { Component, PropTypes } from 'react';

const propTypes = {
  height: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  elements: PropTypes.array.isRequired,
  keyMap: PropTypes.func.isRequired,
  renderMap: PropTypes.func.isRequired,
  selectedIndex: PropTypes.number
};

class Table extends Component {
  render() {
    return (
      <table className={'gap full-width'}>
        <thead>
          <tr>
            <th>{this.props.title}</th>
          </tr>
        </thead>
        <tbody className={'scroll-view-y'} style={{height: this.props.height}}>
          {
            this.props.elements.map((i, index) => 
              <tr className={index === this.props.selectedIndex ? 'selected' : ''} key={this.props.keyMap(i)}>
                <td className={index === this.props.selectedIndex ? 'selected' : ''}>{this.props.renderMap(i)}</td>
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