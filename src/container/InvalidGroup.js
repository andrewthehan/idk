import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';

import FirebaseUtil from '../util/FirebaseUtil';

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
      .then(FirebaseUtil.signIn)
      .then(() => FirebaseUtil.exists('groups/' + this.props.params.id))
      .then(() => browserHistory.push('/idk/' + this.props.params.id))
      .catch(() => {
        this.setState({
          loaded: true
        });
      });
  }

  handleClick() {
    let id = this.createGroup();
    browserHistory.push('/idk/' + id);
  }

  createGroup() {
    let id = this.props.params.id;

    Promise.resolve()
      .then(FirebaseUtil.signIn)
      .then(() => {
        FirebaseUtil.set('groups/' + id, {
          created: Date.now(),
          decideCount: 0
        });
      })
      .catch(route => {
        if(!(route instanceof String)){
          route = '/idk/help';
        }
        browserHistory.push(route);
      });

    return id;
  }

  render() {
    return (
      this.state.loaded
        ?
          <div className={'flex-container-column flex-center'}>
            <p className={'gap'} style={{fontSize: '175%'}}>
              Group <span className={'accent'}>{this.props.params.id}</span> doesn't exist. Would you like to create it?
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