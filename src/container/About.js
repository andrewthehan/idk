import React, { Component } from 'react';
import { browserHistory, Link } from 'react-router';

import shortid from 'shortid';

import FirebaseUtil from '../util/FirebaseUtil';

class About extends Component {

  constructor(){
    super();
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    let id = this.createGroup();
    browserHistory.push('/idk/' + id);
  }

  createGroup() {
    let id = shortid.generate();

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
    let randomId = shortid.generate();

    return (
      <div className={'flex-container-column flex-center'}>
        <div className={'flex-container-column flex-center'}>
          <p className={'gap'}>
            <span className={'accent'}>idk</span> helps groups make decisions. Provide it the options and let it decide for you.
          </p>

          <p className={'gap'}>
            To start, simply click the button below.
          </p>

          <button className={'gap alert'} onClick={this.handleClick}>
            Create a group
          </button>

          <p className={'gap'}>
            Alternatively, visit any path such as
          </p>

          <p className={'gap'}>
            https://andrewthehan.github.io/idk/<Link className={'alert'} to={'/idk/' + randomId}>{randomId}</Link>
          </p>
        </div>

        <p>
          <span className={'accent'}>idk</span> was created by Andrew Han.
        </p>
      </div>
    );
  }
}

export default About;