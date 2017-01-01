import React, { Component, PropTypes } from 'react';
import ReactModal from 'react-modal';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired
};

class Confirm extends Component {

  constructor() {
    super();

    this.handleOnConfirm = this.handleOnConfirm.bind(this);
    this.handleOnCancel = this.handleOnCancel.bind(this);
  }

  handleOnConfirm() {
    this.props.onSubmit(true);
  }

  handleOnCancel() {
    this.props.onSubmit(false);
  }

  render() {
    return (
      <ReactModal
        className={'modal-content'}
        overlayClassName={'modal-overlay'}
        isOpen={this.props.isOpen}
        contentLabel="Confirm"
        onRequestClose={this.handleOnCancel}
      >
        <div className={'flex-container-column flex-space-around'}>
          <p className={'accent'}>Are you sure you want to perform this action?</p>
          <div className={'flex-container-row flex-space-around'}>
            <button className={'alert'} onClick={this.handleOnConfirm}>Confirm</button>
            <button className={'alert'} onClick={this.handleOnCancel}>Cancel</button>
          </div>
        </div>
      </ReactModal>
    );
  }
}

Confirm.propTypes = propTypes;

export default Confirm;