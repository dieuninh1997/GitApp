import React from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, BackHandler, Keyboard, Alert } from 'react-native';
import ScaledSheet from '../libs/reactSizeMatter/ScaledSheet';
import Header from '../components/Header';
import { CommonStyles, CommonSize, CommonColors } from '../utils/CommonStyles';
import SearchIcon from '../../assets/svg/common/search.svg';
import Navigator from '../utils/Navigator';
import rf from '../libs/RequestFactory';
import NetInfo from '@react-native-community/netinfo';
import { RNToasty } from 'react-native-toasty'

class HomeScreen extends React.PureComponent {
  
  state = {
    userName: '',
    focusedInput: '',
    error: '',
    statusInternet: true,
  }

  async componentWillMount() {
    // this.loadStatusInternet();
    BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid);
  }

  onBackButtonPressAndroid = () => {
    Alert.alert(
      'Exit App',
      'Exiting the application?', [{
        text: 'Cancel',
        onPress: () => { },
        style: 'cancel',
      }, {
        text: 'OK',
        onPress: () => BackHandler.exitApp(),
      }], {
        cancelable: false,
      },
    );
    return true;
  }

  renderCenterHeader = () => (
    <Text style={CommonStyles.headerTitle}>Home</Text>
  );

  changeTextInput = (text) => {
    this.setState({ userName: text });
  }

  handleFocus = () => {
    this.setState({ focusedInput: 'userName', error: '' });
  }

  handleBlur = () => {
    this.setState({ focusedInput: '' });
  }

  handleSearchGithubByUsername = async() => {
    const { userName, statusInternet } = this.state;
    Keyboard.dismiss();
    if (!userName) {
      this.setState({ error: 'Please enter username!'});
      return;
    }
    
    try {
      const url = `https://api.github.com/users/${userName}`;
      const responseUser = await rf.getRequest('UserRequest').get(url);
      Navigator.navigate('RepoScreen', {
        username : userName, 
        userRepo: responseUser.data,
      });
    } catch (error) {
      console.log('Search error', error);
      this.setState({ error: error.message });
    }
   
  }

  render() {
    const { userName, focusedInput, error } = this.state;
    
    return (
      <View style={CommonStyles.screen}>
        <Header
          center={this.renderCenterHeader()}
        />
        <View style={styles.container}>
          {/* github logo */}
          <Image
            resizeMode="contain"
            style={styles.logo}
            source={require('../../assets/logo_github.png')}
          />
          {/* search input */}
          <View style={styles.inputContainer}>
            <TextInput
              allowFontScaling={false}
              underlineColorAndroid="transparent"
              keyboardType='default'
              placeholder={'Enter the username'}
              placeholderTextColor={focusedInput === 'userName' ? CommonColors.mainText : CommonColors.border}
              onFocus={this.handleFocus}
              onBlur={this.handleBlur}
              style={styles.textInput}
              value={userName}
              onChangeText={this.changeTextInput}
            />
            <TouchableOpacity 
              onPress={this.handleSearchGithubByUsername}
              style={styles.btnSearch}
            >
              <SearchIcon/>
              {/* <Text>Search</Text> */}
            </TouchableOpacity>
          </View>
          {/* error message */}
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </View>
    );
  }
}
export default HomeScreen;

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  inputContainer: {
    flexDirection: 'row',
    marginTop: '13@s',
    marginHorizontal: '15@s',
    height: CommonSize.inputHeight,
    borderWidth: '1@s',
    borderColor: CommonColors.separator,
    paddingHorizontal: '5@s',
    borderRadius: '5@s',
  },

  textInput: {
    flex: 1,
    fontSize: '14@ms',
    padding: 0,
    margin: 0,
    color: CommonColors.mainText,
    alignItems: 'center',
    justifyContent: 'center',
  },

  btnSearch: {
    justifyContent: 'center',
  },

  logo: {
    width: '200@s',
    height: '200@s',
    marginLeft: '14@s',
    marginRight: '15@s',
  },

  errorText: {
    fontSize: '14@ms',
    color: 'red',
    marginTop: '5@s',
  }
})
