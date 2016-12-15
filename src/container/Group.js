import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import TiTrash from 'react-icons/lib/ti/trash';
import MdInsertLink from 'react-icons/lib/md/insert-link';
import ReactTooltip from 'react-tooltip';

import Table from '../component/Table';
import FirebaseUtil from '../util/FirebaseUtil';
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

  componentDidMount() {
    Promise.resolve()
      .then(() => FirebaseUtil.signIn())
      .catch(route => {
        if(!(route instanceof String)){
          route = '/idk/help';
        }
        browserHistory.push(route);
      })
      .then(() => FirebaseUtil.exists('groups/' + this.props.params.id))
      .then(() => this.bind())
      .catch(route => {
        if(!(route instanceof String)){
          route = '/idk/' + this.props.params.id + '/invalid';
        }
        browserHistory.push(route);
      })
  }

  bind() {
    return new Promise((resolve, reject) => {
      FirebaseUtil.once('groups/' + this.props.params.id, 'value', data => {
        let date = new Date(data.val().created);
        this.setState({
          created: date.toString()
        });
        resolve()
      });
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
      FirebaseUtil.on('groups/' + this.props.params.id + '/options', 'child_added', data => {
        this.state.options.push(data.val());
        this.setState({
          options: this.state.options
        });
      });

      FirebaseUtil.on('groups/' + this.props.params.id + '/options', 'child_removed', data => {
        let index = this.state.options.map(i => i.created).indexOf(data.val().created);
        this.state.options.splice(index, 1);
        this.setState({
          options: this.state.options
        });
      });

      resolve();
    });
  }

  bindFields() {
    return new Promise((resolve, reject) => {
      FirebaseUtil.on('groups/' + this.props.params.id + '/selectedIndex', 'value', data => {
        this.setState({
          selectedIndex: data.val()
        });
      });

      FirebaseUtil.on('groups/' + this.props.params.id + '/decideCount', 'value', data => {
        this.setState({
          decideCount: data.val()
        });
      });

      resolve();
    });
  }

  setSelectedIndex(index) {
  }

  handleChange(e) {
    this.setState({
      toAdd: e.target.value
    })
  }

  handleAdd(e) {
    e.preventDefault();

    const toAdd = this.state.toAdd.trim();

    if(toAdd !== '') {
      FirebaseUtil.push('groups/' + this.props.params.id + '/options', {
        name: toAdd,
        created: Date.now()
      });

      this.setState({
        toAdd: "",
      });
    
      FirebaseUtil.set('groups/' + this.props.params.id + '/selectedIndex', -1);
    }
  }

  handleDecide() {
    if(this.state.options.length !== 0) {
      let index = MathUtil.getRandomInt(0, this.state.options.length);

      FirebaseUtil.set('groups/' + this.props.params.id + '/selectedIndex', index);

      FirebaseUtil.transaction('groups/' + this.props.params.id + '/decideCount', data => data + 1);
    }
  }

  handleClear() {
    if(this.state.options.length > 0) {
      Promise.resolve()
        .then(() => FirebaseUtil.delete('groups/' + this.props.params.id + '/options'))
        .then(() => FirebaseUtil.set('groups/' + this.props.params.id + '/selectedIndex', -1));
    }
  }

  handleDeleteGroup() {
    Promise.resolve()
      .then(() => FirebaseUtil.delete('groups/' + this.props.params.id))
      .then(() => FirebaseUtil.signOut())
      .then(() => browserHistory.push('/idk'))
      .catch(route => {
        if(!(route instanceof String)){
          route = '/idk/help';
        }
        browserHistory.push(route);
      });
  }

  render() {
    return (
      this.state.loaded 
        ? <div className={'flex-container-column'}>
            <h1>
              <span className={'accent'}>Group {this.props.params.id}</span>
              <MdInsertLink
                className={'gap clipboard'}
                data-clipboard-text={window.location.href}
                data-tip="Copy link to clipboard"
              />
              <ReactTooltip place="bottom" effect="solid" />
            </h1>
            <div className={'flex-container-row flex-center'} style={style.content}>
              <div className={'gap flex-fill flex-container-column'} style={style.column}>
                <h2 className={'gap'}><span className={'accent'}>Created On</span>: {this.state.created}</h2>

                <h2 className={'gap'}><span className={'accent'}>Decide Count</span>: {this.state.decideCount}</h2>

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