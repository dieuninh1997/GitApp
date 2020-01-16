import React from 'react';
import { TouchableOpacity } from 'react-native';
import BackIcon from '../../assets/svg/common/back.svg';
import Navigator from '../utils/Navigator';

export default class BackButton extends React.Component {
  _onBack = () => {
    Navigator.goBack();
  };

  render() {
    const { onPress } = this.props;
    return (
      <TouchableOpacity
        hitSlop={{
          top: 30, right: 30, left: 30, bottom: 30,
        }}
        onPress={onPress || this._onBack}
      >
        <BackIcon />
      </TouchableOpacity>
    );
  }
}
