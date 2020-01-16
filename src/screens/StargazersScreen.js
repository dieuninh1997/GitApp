import React from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, FlatList, Platform, ActivityIndicator } from 'react-native';
import ScaledSheet from '../libs/reactSizeMatter/ScaledSheet';
import Header from '../components/Header';
import { CommonStyles, CommonSize, CommonColors } from '../utils/CommonStyles';
import SearchIcon from '../../assets/svg/common/search.svg';
import Navigator from "../utils/Navigator";
import BackButton from '../components/BackButton';
import rf from '../libs/RequestFactory';
import { scale } from '../libs/reactSizeMatter/scalingUtils';
import NetInfo from '@react-native-community/netinfo';
import { RNToasty } from 'react-native-toasty'

class StargazersScreen extends React.PureComponent {
  state = {
    stargazersRepo: [],
    repo: null,
    page: 0,
    loading: false,
    firstLoad: true,
    statusInternet: true,
  }

  async componentDidMount() {
    const { navigation } = this.props;
    const stargazers = navigation.getParam('stargazers', []);
    const item = navigation.getParam('item', []);
    this.setState({ stargazersRepo: stargazers.data, repo: item});
    try {
      const { stargazers_url, id } = item;
      const page = 30;
      const url = `${stargazers_url}?per_page=${page}`;
      const res = await rf.getRequest('UserRequest').get(url);
      const _data = res.data;
      this.setState({ 
        stargazersRepo: [..._data],
        firstLoad: false,
        page,
      });
    } catch (error) {
      console.log('load stargazers error', error);
      this.setState({ firstLoad: false });
    }
  }

  renderCenterHeader = () => (
    <Text style={CommonStyles.headerTitle}>Stargazers</Text>
  );

  renderStargazerItem = ({item, index}) => {
    const { login, avatar_url } = item;
    return (
      <View style={styles.itemStargazer}>
        <Text style={styles.stargazerName}>{index + 1}</Text>
        <Image
          resizeMode="contain"
          style={styles.avatarSmall}
          source={{ uri: avatar_url }}
        />
        <Text style={styles.stargazerName}>{login}</Text>
      </View>
    )
  }

  renderSeparator = () => {
    return (
      <View style={styles.separator} />
    );
  }

  loadMoreStargazers = () => {
    this.setState({ loading: true }, async() => {
      try {
        const page = this.state.page + 30;
        const url = `${this.state.repo.stargazers_url}?per_page=${page}`;
        const response = await rf.getRequest('UserRequest').get(url);
        const staragers = response.data;
  
        if (staragers.length !== 0) {
          this.setState({ 
            stargazersRepo: [...staragers],
            loading: false,
            page,
          });
        } else {
          this.setState({ 
            loading: false,
          });
        }
      } catch (error) {
        console.log('Load more stargazers error', error);
        this.setState({ 
          loading: false,
        });
      }
    })
  }

  renderFooterStargazer = () => {
    const { repo, loading, page } = this.state;
    const stargazersCount = repo ? repo.stargazers_count : 0;
    if (page >= stargazersCount) return <View/>
    return (
      <View style={styles.footer}>
        <TouchableOpacity
          activeOpacity={0.9}
          disabled={loading}
          onPress={this.loadMoreStargazers}
          style={styles.btnLoadMore}>
          <Text style={styles.stargazerName}>Load more stargazers</Text>
          {loading ? (
            <ActivityIndicator color="white" style={{ marginLeft: 8 }} />
          ) : null}
        </TouchableOpacity>
      </View>
    );
  }

  render(){
    const { stargazersRepo, firstLoad } = this.state;
    const { navigation } = this.props;
    
    return(
      <View style={CommonStyles.screen}>
        <Header
          left={<BackButton navigation={navigation} />}
          center={this.renderCenterHeader()}
        />

        {firstLoad ? (
          <View style={styles.firstLoadWrapper}>
            <ActivityIndicator 
              animating 
              size={Platform.OS === 'ios' ? 'large' : scale(40)} 
              color={CommonColors.mainColor} 
            />
          </View>
        ) : null}

        <FlatList
          style={styles.stargazerList}
          keyExtractor={(item, index) => `${index}-${item}`}
          data={stargazersRepo}
          renderItem={this.renderStargazerItem}
          ItemSeparatorComponent={this.renderSeparator}
          ListFooterComponent={this.renderFooterStargazer}
        />
      </View>
    )
  }
}

export default StargazersScreen;


const styles = ScaledSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  stargazerList: {
    margin: '15@s',
  },

  separator: {
    height: '1@s',
    backgroundColor: CommonColors.border,
  },

  footer: {
    padding: '10@s',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: '20@s',
  },

  btnLoadMore: {
    padding: '10@s',
    backgroundColor: CommonColors.emailText,
    borderRadius: '5@s',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  stargazerName: {
    fontSize: '14@s',
    textAlign: 'center',
    marginLeft: '5@s',
  },

  itemStargazer: {
    flexDirection: 'row',
    padding: '5@s',
    alignItems: 'center',
  },

  avatarSmall: {
    width: '30@s',
    height: '30@s',
    marginLeft: '5@s',
  },

  firstLoadWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
