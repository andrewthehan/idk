import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import TiTrash from 'react-icons/lib/ti/trash';
import MdInsertLink from 'react-icons/lib/md/insert-link';
import ReactTooltip from 'react-tooltip';

import * as firebase from 'firebase';

import Table from '../component/Table';
import MathUtil from '../util/MathUtil';

const propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string
  })
};

const style = {
  content: {
    width: '50%',
    minWidth: '640px'
  },
  column: {
    alignSelf: 'flex-start'
  },
  trash: {
    position: 'absolute',
    bottom: '0',
    right: '0',
    width: '64px',
    height: '64px',
    padding: '0px',
    fontSize: '250%'
  }
}

class Group extends Component {

  constructor() {
    super();

    this.handleAdd = this.handleAdd.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleDecide = this.handleDecide.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.handleDeleteGroup = this.handleDeleteGroup.bind(this);

    this.state = {
      loaded: false,
      toAdd: '',
      options: [],
      selectedIndex: -1,
      decideCount: 0
    };
  }

  componentDidMount(){
    Promise.resolve()
      .then(() => this.getGroup())
      .then(() => this.bind())
      .catch(() => {
        browserHistory.push('/idk/' + this.props.params.id + '/invalid');
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

  bind() {
    new Promise((resolve, reject) => {
      const group = firebase.database().ref('groups/' + this.props.params.id);

      group.once('value', data => {
        let date = new Date(data.val().created);
        this.setState({
          created: date.toString()
        });
      });

      resolve();
    })
      .then(() => this.bindOptions())
      .then(() => this.bindFields())
      .then(() => {
        this.setState({
          loaded: true
        });
      });
  }

  bindOptions() {
    return new Promise((resolve, reject) => {
      const groupOptions = firebase.database().ref('groups/' + this.props.params.id + '/options');

      const options = this.state.options;

      groupOptions.on('child_added', data => {
        options.push(data.val());
        this.setState(options);
      });

      groupOptions.on('child_removed', data => {
        let index = this.state.options.map(i => i.created).indexOf(data.val().created);
        options.splice(index, 1);
        this.setState({
          options
        });
      });

      resolve();
    });
  }

  bindFields() {
    return new Promise((resolve, reject) => {
      const groupSelectedIndex = firebase.database().ref('groups/' + this.props.params.id + '/selectedIndex');

      groupSelectedIndex.on('value', data => {
        this.setState({
          selectedIndex: data.val()
        });
      });
    
      const groupDecideCount = firebase.database().ref('groups/' + this.props.params.id + '/decideCount');

      groupDecideCount.on('value', data => {
        this.setState({
          decideCount: data.val()
        });
      });

      resolve();
    });
  }

  setSelectedIndex(index) {
    this.setState({
      selectedIndex: index
    });

    const groupSelectedIndex = firebase.database().ref('groups/' + this.props.params.id + '/selectedIndex');
    groupSelectedIndex.set(index);
  }

  handleChange(e) {
    this.setState({
      toAdd: e.target.value
    })
  }

  handleAdd(e) {
    e.preventDefault();

    const toAdd = this.state.toAdd.trim();

    if(toAdd !== ''){
      const groupOptions = firebase.database().ref('groups/' + this.props.params.id + '/options');

      groupOptions.push({
        created: Date.now(),
        name: toAdd
      });

      this.setState({
        toAdd: "",
      });

      this.setSelectedIndex(-1);
    }
  }

  handleDecide() {
    if(this.state.options.length !== 0){
      let index = MathUtil.getRandomInt(0, this.state.options.length);
      this.setSelectedIndex(index);

      let decideCount = this.state.decideCount + 1;

      this.setState({
        decideCount
      });

      const groupDecideCount = firebase.database().ref('groups/' + this.props.params.id + '/decideCount');
      groupDecideCount.transaction(data => data + 1);
    }
  }

  handleClear() {
    if(this.state.options.length > 0){
      const groupOptions = firebase.database().ref('groups/' + this.props.params.id + '/options');

      groupOptions
        .remove()
        .then(() => this.bindOptions());

      this.setState({
        options: [],
        selectedIndex: -1
      });
    }
  }

  handleDeleteGroup() {
    const group = firebase.database().ref('groups/' + this.props.params.id);

    group
      .remove()
      .then(() => browserHistory.push('/idk'));
  }

  render() {
    return (
      this.state.loaded 
        ? <div className={'flex-container-column'}>
            <h1>
              Group '{this.props.params.id}'
              <MdInsertLink
                className={'gap clipboard'}
                data-clipboard-text={window.location.href}
                data-tip="Copy link to clipboard"
              />
              <ReactTooltip place="bottom" effect="solid" />
            </h1>
            <div className={'flex-container-row flex-center'} style={style.content}>
              <div className={'gap flex-fill flex-container-column'} style={style.column}>
                <div className={'gap flex-container-row'}>
                  <h2 className={'gap'}>Created on:</h2>
                  <p className={'gap'}>{this.state.created}</p>
                </div>

                <div className={'gap flex-container-row'}>
                  <h2 className={'gap'}>Decide Count:</h2>
                  <p className={'gap'}>{this.state.decideCount}</p>
                </div>

                <button className={'gap'} onClick={this.handleDecide}>Decide</button>
              </div>

              <div className={'gap flex-fill flex-container-column'} style={style.column}>
                <form className={'gap flex-container-row flex-space-between'} onSubmit={this.handleAdd}>
                  <input className={'gap full-width'} type="text" value={this.state.toAdd} onChange={this.handleChange}></input>
                  <input className={'gap'} type="submit" value="Submit" />
                </form>

                <Table
                  height={'500px'}
                  title={'Options'}
                  elements={this.state.options}
                  keyMap={i => i.created}
                  renderMap={i => i.name}
                  selectedIndex={this.state.selectedIndex}
                />

                <button
                  className={'full-width ' + (this.state.options.length === 0 ? 'disabled' : 'alert')}
                  onClick={this.handleClear}
                  disabled={this.state.options.length === 0}
                >
                  Clear options
                </button> 
              </div>
            </div>

            <button className={'gap alert'} style={style.trash} onClick={this.handleDeleteGroup}>
              <TiTrash />
            </button>
          </div>
        : 
          <div className={'flex-container-column flex-center'}>
            <p>Loading...</p>
          </div>
    );
  }
}

Group.propTypes = propTypes;

export default Group;