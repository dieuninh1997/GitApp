import { StatusBar, Platform } from 'react-native';
import { moderateScale, scale } from '../libs/reactSizeMatter/scalingUtils';
import Utils from './Utils';

class CommonSize {
  static inputHeight = '40@s';

  static paddingTopHeader = Platform.OS === 'ios'
    ? (Utils.isIphoneX() ? scale(34) : scale(20)) : StatusBar.currentHeight;

  static headerHeight = scale(44) + CommonSize.paddingTopHeader;
}


class CommonColors {
  static screenBgColor = '#FFFFFF';

  static headerTitleColor = '#FFFFFF';

  static headerBarBgColor = '#24292e';

  static separator = '#383b6b';

  static border = '#c9d1d3';

  static mainColor = '#0d298a';
  
  //text
  static mainText = '#000000';

  static secondaryText = '#b9bacb';

  static emailText = '#2ea6d6';
}



const CommonStyles = {
  screen: {
    flex: 1,
    backgroundColor: CommonColors.screenBgColor,
  },
  header: {
    backgroundColor: CommonColors.headerBarBgColor,
    elevation: 0,
    height: CommonSize.headerHeight,
    paddingTop: CommonSize.paddingTopHeader,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: moderateScale(17),
    fontWeight: 'normal',
    color: CommonColors.headerTitleColor,
    textAlignVertical: 'center',
    textAlign: 'center',
  },
}

export {
  CommonStyles, CommonColors, CommonSize, 
};
