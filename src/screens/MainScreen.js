import React from 'react';
import { createBottomTabNavigator, TabBarBottom } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { View } from 'react-native';
import HomeScreen from './HomeScreen';
import RepoScreen from './RepoScreen';
import StargazersScreen from './StargazersScreen';
import Navigator from '../utils/Navigator';

const MainScreenNavigator = createStackNavigator({
  HomeScreen: { screen: HomeScreen },
  RepoScreen: { screen: RepoScreen },
  StargazersScreen: { screen: StargazersScreen },
}, {
  headerMode: 'none',
});

export default class MainScreen extends React.PureComponent {
  handleNavigationChange = () => {
  }

  static router = MainScreenNavigator.router;

  render() {
    const { navigation } = this.props;
    Navigator.setTopLevelNavigator(navigation);
    return (
      <View style={{ flex: 1 }}>
        <MainScreenNavigator
          onNavigationStateChange={this.handleNavigationChange}
          uriPrefix="/app"
          navigation={navigation}
        />
      </View>
    );
  }
}
