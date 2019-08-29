import React from 'react';
import PropTypes from 'prop-types';
import className from 'classnames';
import { noop } from 'lodash';

import { Button } from '@folio/stripes/components';

import css from './PluginFindRecord.css';

class PluginFindRecord extends React.Component {
  state = {
    openModal: false,
  }

  getStyle() {
    const { marginTop0 } = this.props;

    return className(
      css.searchControl,
      { [css.marginTop0]: marginTop0 },
    );
  }

  openModal = () => this.setState({
    openModal: true,
  });

  closeModal = () => this.setState({
    openModal: false,
  });

  passRecordsOut = records => {
    this.props.selectRecordsCb(records);
    this.closeModal();
  }

  passRecordOut = (e, record) => {
    this.passRecordsOut([record]);
  }

  render() {
    const {
      children,
      disabled,
      searchButtonStyle,
      searchLabel,
      marginBottom0,
    } = this.props;

    return (
      <div className={this.getStyle()}>
        <Button
          data-test-plugin-find-record-button
          buttonStyle={searchButtonStyle}
          disabled={disabled}
          key="searchButton"
          marginBottom0={marginBottom0}
          onClick={this.openModal}
        >
          {searchLabel}
        </Button>
        {this.state.openModal && children({
          onSaveMultiple: this.passRecordsOut,
          onSelectRow: this.passRecordOut,
          closeModal: this.closeModal,
        })}
      </div>
    );
  }
}

PluginFindRecord.propTypes = {
  searchLabel: PropTypes.node.isRequired,
  children: PropTypes.func,
  disabled: PropTypes.bool,
  marginBottom0: PropTypes.bool,
  marginTop0: PropTypes.bool,
  searchButtonStyle: PropTypes.string,
  selectRecordsCb: PropTypes.func,
};

PluginFindRecord.defaultProps = {
  disabled: false,
  marginBottom0: true,
  marginTop0: true,
  searchButtonStyle: 'primary',
  selectRecordsCb: noop,
};

export default PluginFindRecord;
