import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';

import * as firebase from 'firebase';

const propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string
  })
};

class InvalidGroup extends Component {
  constructor(){
    super();
    this.handleClick = this.handleClick.bind(this);

    this.state = {
      loaded: false
    };
  }

  componentDidMount(){
    Promise.resolve()
      .then(() => this.getGroup())
      .then(() => {
        browserHistory.push('/idk/' + this.props.params.id);
      })
      .catch(() => {
        this.setState({
          loaded: true
        });
      });
  }

  getGroup() {
    const group = firebase.database().ref('groups/' + this.props.params.id);

    return new Promise((resolve, reject) => {
      group.once('value', data => {
        if(data.val() == null) {
          reject();
        }
        else {
          resolve();
        }
      });
    }); 
  }

  handleClick() {
    let id = this.createGroup();
    browserHistory.push('/idk/' + id);
  }

  createGroup() {
    let id = this.props.params.id;
    firebase.database().ref('groups/' + id).set({
      created: Date.now(),
      decideCount: 0
    });
    return id;
  }

  render() {
    return (
      this.state.loaded
        ?
          <div className={'flex-container-column flex-center'}>
            <p className={'gap'} style={{fontSize: '175%'}}>
              Group '{this.props.params.id}' doesn't exist. Would you like to create it?
            </p>
            <button className={'gap alert'} onClick={this.handleClick}>
              Create '{this.props.params.id}'
            </button>
          </div>
        : 
          <div className={'flex-container-column flex-center'}>
            <p>Loading...</p>
          </div>
    );
  }

}

InvalidGroup.propTypes = propTypes;

export default InvalidGroup;