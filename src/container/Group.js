import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import TiTimes from 'react-icons/lib/ti/times';
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
    width: '80%'
  },
  column: {
    margin: '5%',
    alignSelf: 'flex-start'
  },
  optionInput: {
    padding: '4px',
    fontSize: '120%'
  },
  optionRow: {
    padding: '4px',
    fontSize: '120%'
  },
  chatInput: {
    padding: '4px',
    fontSize: '110%'
  },
  chatSend: {
    fontSize: '100%'
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

const systemMessagePrefix = '[System]: ';
const joinString = ' has joined the group.';
const leaveString = ' has left the group.';

class Group extends Component {

  constructor() {
    super();

    this.handleOptionAdd = this.handleOptionAdd.bind(this);
    this.handleOptionInputChange = this.handleOptionInputChange.bind(this);
    this.handleDecide = this.handleDecide.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleDeleteOption = this.handleDeleteOption.bind(this);
    this.handleChatSend = this.handleChatSend.bind(this);
    this.handleChatInputChange = this.handleChatInputChange.bind(this);
    this.handleDeleteGroup = this.handleDeleteGroup.bind(this);

    this.state = {
      loaded: false,
      user: '',
      optionInputString: '',
      options: [],
      selectedIndex: -1,
      decideCount: 0,
      chatInputString: '',
      messages: []
    };
  }

  componentWillMount() {
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
      .then(() => setTimeout(() => {
        let prefix =
          systemMessagePrefix +
          '\'' + 
            this.state.user +
            ' (' +
              FirebaseUtil.getCurrentUser().uid.substring(0, 6) +
            ')' + 
          '\''
        ;
        this.addChatMessage(prefix + joinString);
        window.onbeforeunload = () => this.addChatMessage(prefix + leaveString);
      }, 2000));
  }

  bind() {
    return (
      new Promise((resolve, reject) => {
        FirebaseUtil.once('groups/' + this.props.params.id, 'value', data => {
          let date = new Date(data.val().created);
          this.setState({
            created: date.toString()
          });
          resolve()
        });
      })
      .then(() => this.bindOptions())
      .then(() => this.bindMessages())
      .then(() => this.bindFields())
      .then(() => {
        this.setState({
          loaded: true
        });
      })
    );
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

      FirebaseUtil.on('groups/' + this.props.params.id + '/options', 'child_changed', data => {
        let index = this.state.options.map(i => i.created).indexOf(data.val().created);
        let options = this.state.options;
        options[index].name = data.val().name;
        this.setState({
          options
        });
      });

      resolve();
    });
  }

  bindMessages() {
    return new Promise((resolve, reject) => {
      FirebaseUtil.on('groups/' + this.props.params.id + '/messages', 'child_added', data => {
        this.state.messages.push(data.val());
        this.setState({
          messages: this.state.messages
        });
      });

      FirebaseUtil.on('groups/' + this.props.params.id + '/messages', 'child_removed', data => {
        let index = this.state.messages.map(i => i.created).indexOf(data.val().created);
        this.state.messages.splice(index, 1);
        this.setState({
          messages: this.state.messages
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

  addChatMessage(message) {
    if(message !== '') {
      FirebaseUtil.push('groups/' + this.props.params.id + '/messages', {
        name: message,
        created: Date.now()
      });
    }
  }

  handleOptionInputChange(e) {
    this.setState({
      optionInputString: e.target.value
    })
  }

  handleOptionAdd(e) {
    e.preventDefault();

    const optionInputString = this.state.optionInputString.trim();

    if(optionInputString !== '') {
      FirebaseUtil.push('groups/' + this.props.params.id + '/options', {
        name: optionInputString,
        created: Date.now()
      });

      this.setState({
        optionInputString: "",
      });
    
      FirebaseUtil.set('groups/' + this.props.params.id + '/selectedIndex', -1);
    }
  }

  handleDecide() {
    if(this.state.options.length !== 0) {
      let index = MathUtil.getRandomInt(0, this.state.options.length);

      FirebaseUtil.set('groups/' + this.props.params.id + '/selectedIndex', index);

      FirebaseUtil.transaction('groups/' + this.props.params.id + '/decideCount', data => data + 1);

      this.addChatMessage(systemMessagePrefix + ' decided on \'' + this.state.options[index].name + '\'.');
    }
  }

  handleClear() {
    if(this.state.options.length > 0) {
      Promise.resolve()
        .then(() => FirebaseUtil.delete('groups/' + this.props.params.id + '/options'))
        .then(() => FirebaseUtil.set('groups/' + this.props.params.id + '/selectedIndex', -1));
    }
  }

  handleChangeName(e, index) {
    FirebaseUtil.once('groups/' + this.props.params.id + '/options', 'value', data => {
      let i = 0;
      data.forEach(option => {
        if(i === index){
          FirebaseUtil.set('groups/' + this.props.params.id + '/options/' + option.key + '/name', e.target.value);
        }
        ++i;
      });
    });
  }

  handleDeleteOption(index) {
    FirebaseUtil.once('groups/' + this.props.params.id + '/options', 'value', data => {
      let i = 0;
      data.forEach(option => {
        if(i === index){
          FirebaseUtil.delete('groups/' + this.props.params.id + '/options/' + option.key);
          if(i === this.state.selectedIndex){
            FirebaseUtil.set('groups/' + this.props.params.id + '/selectedIndex', -1);
          }
          else if(i < this.state.selectedIndex){
            FirebaseUtil.set('groups/' + this.props.params.id + '/selectedIndex', this.state.selectedIndex - 1);
          }
        }
        ++i;
      });
    });
  }

  handleChatInputChange(e) {
    this.setState({
      chatInputString: e.target.value
    })
  }

  handleChatSend(e) {
    e.preventDefault();

    if(this.state.chatInputString.trim().length > 0){
      let prefix =
        '[' + 
          this.state.user +
          ' (' +
            FirebaseUtil.getCurrentUser().uid.substring(0, 6) +
          ')' + 
        ']: '
      ;

      this.addChatMessage(prefix + this.state.chatInputString.trim());

      this.setState({
        chatInputString: "",
      });
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
                className={'gap clickable-icon'}
                data-clipboard-text={window.location.href}
                data-tip="Copy link to clipboard"
              />
              <ReactTooltip place="bottom" effect="solid" />
            </h1>
            <div className={'flex-container-row flex-space-around'} style={style.content}>
              <div className={'gap flex-fill flex-container-column'} style={style.column}>
                <h2 className={'gap'}><span className={'accent'}>Created On</span>: {this.state.created}</h2>

                <h2 className={'gap'}><span className={'accent'}>Decide Count</span>: {this.state.decideCount}</h2>

                <button className={'gap'} onClick={this.handleDecide}>Decide</button>

                <Table
                  height={'400px'}
                  fontSize={'105%'}
                  reverse
                  title={'Chat'}
                  elements={this.state.messages}
                  keyMap={i => i.created}
                  renderMap={(i, index, isHovered) => 
                    <div>
                      {i.name}
                    </div>
                  }
                />
                <form className={'flex-container-row flex-space-between'} onSubmit={this.handleChatSend}>
                  <input
                    className={'full-width'}
                    style={style.chatInput}
                    type="text"
                    value={this.state.chatInputString}
                    placeholder="Input a message"
                    onChange={this.handleChatInputChange}
                  />
                  <input style={style.chatSend} type="submit" value="Send" />
                </form>
              </div>

              <div className={'gap flex-fill flex-container-column'} style={style.column}>
                <form className={'gap flex-container-row flex-space-between'} onSubmit={this.handleOptionAdd}>
                  <input
                    className={'gap full-width'}
                    style={style.optionInput}
                    type="text"
                    value={this.state.optionInputString}
                    placeholder="Input an option"
                    onChange={this.handleOptionInputChange}
                  />
                  <input className={'gap'} type="submit" value="Add" />
                </form>

                <Table
                  height={'500px'}
                  fontSize={'125%'}
                  title={'Options'}
                  elements={this.state.options}
                  keyMap={i => i.created}
                  renderMap={(i, index, isHovered) => 
                    <div className={'flex-container-row flex-space-between'}>
                      <input
                        className={'flex-fill invisible-background-color ' + (index === this.state.selectedIndex ? 'selected' : '')}
                        style={style.optionRow}
                        type="text"
                        value={i.name}
                        onChange={e => this.handleChangeName(e, index)}
                      />
                      <TiTimes
                        className={isHovered ? 'clickable-icon' : 'invisible-color'}
                        onClick={() => this.handleDeleteOption(index)}
                      />
                    </div>
                  }
                />

                <button
                  className={'gap full-width ' + (this.state.options.length === 0 ? 'disabled' : 'alert')}
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