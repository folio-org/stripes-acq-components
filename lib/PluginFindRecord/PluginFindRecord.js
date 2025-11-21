import React from 'react';
import PropTypes from 'prop-types';
import className from 'classnames';
import noop from 'lodash/noop';
import contains from 'dom-helpers/query/contains';

import {
  Button,
  Icon,
} from '@folio/stripes/components';

import css from './PluginFindRecord.css';

class PluginFindRecord extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      openModal: false,
    };

    this.modalTrigger = React.createRef();
    this.modalRef = React.createRef();
  }

  getStyle() {
    const { marginBottom0, marginTop0 } = this.props;

    return className(
      css.searchControl,
      { [css.marginBottom0]: marginBottom0 },
      { [css.marginTop0]: marginTop0 },
    );
  }

  openModal = () => this.setState({
    openModal: true,
  });

  closeModal = () => {
    let shouldFocusTrigger;

    if (this.modalRef.current && this.modalTrigger.current) {
      shouldFocusTrigger = contains(this.modalRef.current, document.activeElement);
    }

    this.setState({
      openModal: false,
    }, () => {
      if (shouldFocusTrigger) {
        this.modalTrigger.current.focus();
      }
    });

    this.props.onClose?.();
  }

  passRecordsOut = records => {
    this.props.selectRecordsCb(records);
    this.closeModal();
  }

  passRecordOut = (e, record) => {
    this.passRecordsOut([record]);
  }

  renderDefaultTrigger() {
    const { disabled, marginBottom0, searchButtonStyle, searchLabel } = this.props;

    return (
      <Button
        buttonRef={this.modalTrigger}
        buttonStyle={searchButtonStyle}
        data-test-plugin-find-record-button
        disabled={disabled}
        key="searchButton"
        marginBottom0={marginBottom0}
        onClick={this.openModal}
      >
        {searchLabel}
      </Button>
    );
  }

  renderTriggerButton() {
    const {
      renderTrigger,
    } = this.props;

    return renderTrigger
      ? renderTrigger({
        buttonRef: this.modalTrigger,
        onClick: this.openModal,
      })
      : this.renderDefaultTrigger();
  }

  render() {
    const { children, validateSelectedRecords, trigerless } = this.props;

    return (
      <div className={this.getStyle()}>
        {!trigerless && this.renderTriggerButton()}
        {(this.state.openModal || trigerless) && children({
          onSaveMultiple: this.passRecordsOut,
          onSelectRow: this.passRecordOut,
          closeModal: this.closeModal,
          modalRef: this.modalRef,
          validateSelectedRecords,
        })}
      </div>
    );
  }
}

PluginFindRecord.propTypes = {
  children: PropTypes.func,
  disabled: PropTypes.bool,
  marginBottom0: PropTypes.bool,
  marginTop0: PropTypes.bool,
  onClose: PropTypes.func,
  renderTrigger: PropTypes.func,
  searchButtonStyle: PropTypes.string,
  searchLabel: PropTypes.node,
  selectRecordsCb: PropTypes.func,
  trigerless: PropTypes.bool,
  validateSelectedRecords: PropTypes.func,
};

PluginFindRecord.defaultProps = {
  disabled: false,
  marginBottom0: true,
  marginTop0: true,
  searchButtonStyle: 'primary',
  selectRecordsCb: noop,
  searchLabel: <Icon icon="search" color="#fff" />,
  trigerless: false,
};

export default PluginFindRecord;
