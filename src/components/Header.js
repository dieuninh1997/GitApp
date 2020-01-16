import React, { Component } from 'react';
import { StatusBar, View } from 'react-native';
import PropTypes from 'prop-types';
import ScaledSheet from '../libs/reactSizeMatter/ScaledSheet';
import { CommonSize, CommonStyles } from '../utils/CommonStyles';
import { scale } from '../libs/reactSizeMatter/scalingUtils';

export default class Header extends Component {
    static propTypes = {
      left: PropTypes.any,
      center: PropTypes.any,
      right: PropTypes.any,
      showStatusBar: PropTypes.bool,
      headerStyle: PropTypes.object,
      centerStyle: PropTypes.object,
      rightStyle: PropTypes.object,
      leftStyle: PropTypes.object,
    };

    render() {
      const {
        left, center, right, showStatusBar, headerStyle, centerStyle, rightStyle, leftStyle
      } = this.props;
      return (
        <View style={[CommonStyles.header, headerStyle]}>
          {showStatusBar && (
            <StatusBar
              backgroundColor="transparent"
              translucent
              barStyle="light-content"
            />
          )}
          <View style={[styles.center, centerStyle]}>
            {center}
          </View>
          <View style={[styles.left, leftStyle]}>
            {left}
          </View>
          <View style={[styles.right, rightStyle]}>
            {right}
          </View>
        </View>
      );
    }
}

Header.defaultProps = {
  showStatusBar: true,
};

const styles = ScaledSheet.create({
  left: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: scale(15),
  },
  right: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(15),
  },
  center: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    top: CommonSize.paddingTopHeader,
    bottom: 0,
  },
});
