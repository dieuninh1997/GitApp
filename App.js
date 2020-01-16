import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Navigator from './src/utils/Navigator';
import MainScreen from './src/screens/MainScreen';

const AppNavigator = createStackNavigator({
  MainScreen: { screen: MainScreen },
},
{
  headerMode: 'none',
});

const Navigation = createAppContainer(AppNavigator);

export default class App extends React.PureComponent {
  render() {
    return (
      <Navigation 
        ref={navigatorRef => Navigator.setTopLevelNavigator(navigatorRef)} 
      />
     );
  }
}
