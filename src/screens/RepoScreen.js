import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput, 
  Image, 
  FlatList, 
  RefreshControl, 
  ActivityIndicator, 
  Platform, 
  SectionList, 
  Animated,
  Easing
} from 'react-native';
import ScaledSheet from '../libs/reactSizeMatter/ScaledSheet';
import Header from '../components/Header';
import BackButton from '../components/BackButton';
import { CommonStyles, CommonColors } from '../utils/CommonStyles';
import rf from '../libs/RequestFactory';
import { scale } from '../libs/reactSizeMatter/scalingUtils';
import StarIcon from '../../assets/svg/common/star.svg';
import Navigator from '../utils/Navigator';
import ArrowIcon from '../../assets/svg/common/arrow.svg';
import NetInfo from '@react-native-community/netinfo';
import { RNToasty } from 'react-native-toasty'

const INITIAL_PAGE = 0;

class RepoScreen extends React.PureComponent {

  state = {
    user: null,
    userRepos: [],
    stargazersRepo: [],
    loading: false,
    firstLoad: true,
    page: INITIAL_PAGE,
    statusInternet: true,
  }

  async componentDidMount(){
    //get repos of user
    const { navigation } = this.props;
    const userName = navigation.getParam('username', null);
    const userRepo = navigation.getParam('userRepo', null);
    if (userRepo) this.getUserInfoSuccess(userRepo);
  }

  getUserInfoSuccess = (responseUser) => {
    const { repos_url } = responseUser;
    this.setState({ user: responseUser });
    this.getUserReposFirstTime(`${repos_url}?per_page=${INITIAL_PAGE}`);
  }

  getUserReposFirstTime = async(url) => {
    try {
      const page = this.state.page + 30;
      const response = await rf.getRequest('UserRequest').get(url);
      const repos = response.data;
      const newRepos = repos.map(item => {
        return {
          ...item,
          showStargazer: false,
        }
      });

      if (newRepos.length !== 0) {
        this.setState({ 
          userRepos: [...this.state.userRepos, ...newRepos],
          firstLoad: false,
          page,
        });
      } else {
        this.setState({ 
          firstLoad: false,
        });
      }
    } catch (error) {
      console.log('Load repos error', error);
      this.setState({ 
        firstLoad: false,
      });
    }
  }

  renderCenterHeader = () => (
    <Text style={CommonStyles.headerTitle}>Repository</Text>
  );

  handleLoadStargazers = async(item) => {
    if (!item) return;

    if (!item.showStargazer) {
      item.showStargazer = true;
    } else {
      item.showStargazer = false;
    }

    try {
      const { stargazers_url, id } = item;
      const page = 5;
      const url = `${stargazers_url}?per_page=${page}`;
      const res = await rf.getRequest('UserRequest').get(url);
      const stargazers = res.data;
      const stargazersRepo = [
        ...this.state.stargazersRepo, 
        { 
          id: id, 
          data: [...stargazers],
          page: page,
          loading: false,
        }
      ];
      this.setState({ 
        stargazersRepo,
      });
    } catch (error) {
      console.log('load stargazer first time error', error);
    }
  }

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

  renderEmptyStargazer = () => {
    return (<Text>No stargazer</Text>)
  }
  
  renderStargazerList = (item) => {
    const { stargazersRepo } = this.state;
    const {data} = stargazersRepo.find(e => e.id === item.id);
    
    return (
      <FlatList
        style={[styles.stargazerList, data.length > 9 ? { height: scale(300) } : null]}
        keyExtractor={(item, index) => `${index}-${item}`}
        data={data}
        renderItem={this.renderStargazerItem}
        ItemSeparatorComponent={this.renderSeparator}
        ListFooterComponent={() => this.renderFooterStargazer(item)}
        ListEmptyComponent={this.renderEmptyStargazer}
      />
    )
  }

  renderItem = ({item, index}) => {
    const {stargazers_count, full_name, showStargazer} = item;
    const repoName = full_name.split("/")[1];
    
    return (
      <View>
        <View style={styles.itemContainer}>
          <Text>{index + 1}</Text>
          <Text style={styles.repoText}>{repoName}</Text>
          <Text>{stargazers_count}</Text>
          <StarIcon style={styles.starIcon}/>
          <TouchableOpacity 
            style={styles.btnLoadStargazers}
            onPress={() => this.handleLoadStargazers(item)}>
            <Text style={styles.btnLoadStargazersText}>Load stargazers</Text>
          </TouchableOpacity>
        </View>
        {showStargazer ? this.renderStargazerList(item) : null}
      </View>
      
    );
  }

  renderSeparator = () => {
    return (
      <View style={styles.separator} />
    );
  }

  loadMoreData = () => {
    const { statusInternet } = this.state;
    if (!statusInternet) {
      RNToasty.Show({
        title: 'No internet!'
      });
      return;
    }
    this.setState({ loading: true }, async() => {
      try {
        const page = this.state.page + 30;
        const url = `${this.state.user.repos_url}?per_page=${page}`;
        const response = await rf.getRequest('UserRequest').get(url);
        const repos = response.data;
        const newRepos = repos.map(item => {
          return {
            ...item,
            showStargazer: false,
          }
        });
  
        if (newRepos.length !== 0) {
          this.setState({ 
            userRepos: [...newRepos],
            loading: false,
            page,
          });
        } else {
          this.setState({ 
            loading: false,
          });
        }
      } catch (error) {
        console.log('Load more repos error', error);
        this.setState({ 
          loading: false,
        });
      }
    })
  }


  loadMoreStargazers = (item) => {
    const stargazers = this.state.stargazersRepo.find(e => e.id === item.id);
    Navigator.navigate('StargazersScreen', {stargazers, item});
  }

  renderFooter = () => {
    const { user, page, loading } = this.state;
    if (page >= user.public_repos) return <View/>
    return (
      <View style={styles.footer}>
        <TouchableOpacity
          activeOpacity={0.9}
          disabled={loading}
          onPress={this.loadMoreData}
          style={styles.btnLoadMore}>
          <Text style={styles.btnText}>Load more</Text>
          {loading ? (
            <ActivityIndicator color="white" style={{ marginLeft: 8 }} />
          ) : null}
        </TouchableOpacity>
      </View>
    );
  }

  renderFooterStargazer = (item) => {
    const { user, stargazersRepo } = this.state;
    const {data, page, loading} = stargazersRepo.find(e => e.id === item.id);
    if (data.length === 0 || page >= item.stargazers_count) return <View/>
    return (
      <View style={styles.footer}>
        <TouchableOpacity
          activeOpacity={0.9}
          disabled={loading}
          onPress={() => this.loadMoreStargazers(item)}
          style={styles.btnLoadMore}>
          <Text style={styles.stargazerName}>Load more stargazers</Text>
          {loading ? (
            <ActivityIndicator color="white" style={{ marginLeft: 8 }} />
          ) : null}
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    const { navigation } = this.props;
    const { user, firstLoad, userRepos} = this.state;
    if (!user) return <View/>;
    const { avatar_url, login, name, email, public_repos } = user;

    return (
      <View style={CommonStyles.screen}>
        <Header
          left={<BackButton navigation={navigation} />}
          center={this.renderCenterHeader()}
        />
        {/* user info */}
        <View style={styles.userInfoContainer}>
          {/* avatar */}
          <Image
            resizeMode="contain"
            style={styles.avatar}
            source={{ uri: avatar_url }}
          />
          {/* info */}
          <View style={styles.infoDetailContainer}>
            <Text style={styles.nameText}>{name}</Text>
            <Text style={styles.accountText}>{login}</Text>
            <Text style={styles.accountText}>{`Public repositories: ${public_repos}`}</Text>
            <Text style={styles.emailText}>{email}</Text>
          </View>
        </View>
        <View style={styles.container}>
          {/* user repos */}
          <Text style={styles.accountText}>Popular repositories</Text>
          {/* indicator */}
          {firstLoad ? (
            <View style={styles.firstLoadWrapper}>
              <ActivityIndicator 
                animating 
                size={Platform.OS === 'ios' ? 'large' : scale(40)} 
                color={CommonColors.mainColor} 
              />
            </View>
          ) : null}
          {/* repo list */}
          {userRepos.length > 0 ? (
            <FlatList
              style={styles.repoList}
              keyExtractor={(item, index) => `${index}-${item}`}
              data={userRepos}
              renderItem={this.renderItem}
              ItemSeparatorComponent={this.renderSeparator}
              ListFooterComponent={this.renderFooter}
              contentContainerStyle={{flexGrow: 1}}
            />
          ) : null}
         
        </View>
      </View>
    );
  }
}
export default RepoScreen;

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    padding: '15@s',
  },
  
  userInfoContainer: {
    flexDirection: 'row',
    padding: '15@s',
    borderBottomWidth: '1@s',
    borderBottomColor: CommonColors.border,
  },

  avatar: {
    width: '100@s',
    height: '100@s',
  },

  avatarSmall: {
    width: '20@s',
    height: '20@s',
    marginLeft: '5@s',
  },

  infoDetailContainer: {
    marginLeft: '15@s',
  },

  nameText: {
    fontSize: '18@ms',
    color: CommonColors.mainText,
  },

  accountText: {
    fontSize: '14@ms',
    color: CommonColors.secondText,
    marginBottom: '15@s',
  },

  emailText: {
    fontSize: '14@ms',
    color: CommonColors.emailText,
    marginTop: '5@s',
  },

  firstLoadWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyText: {
    fontSize: '14@ms',
    color: CommonColors.mainText,
    marginTop: '10@s',
  },

  itemContainer: {
    flexDirection: 'row',
    height: '40@s',
    alignItems: 'center',
    paddingHorizontal: '10@s',
  },

  starIcon: {
    width: '10@s',
    height: '10@s',
    color: CommonColors.border,
    marginHorizontal: '5@s',
  },

  repoText: {
    flex: 1,
    marginHorizontal: '10@s',
  },

  separator: {
    height: '1@s',
    backgroundColor: CommonColors.border,
  },

  repoList: { 
    flex: 1, 
    borderWidth: 1, 
    borderColor: CommonColors.border, 
    borderRadius: scale(5), 
  },

  footer: {
    padding: '10@s',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },

  btnLoadMore: {
    padding: '10@s',
    backgroundColor: CommonColors.emailText,
    borderRadius: '5@s',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  btnText: {
    color: 'white',
    fontSize: '14@s',
    textAlign: 'center',
  },

  btnLoadStargazersText: {
    color: 'white',
    fontSize: '11@s',
    textAlign: 'center',
    marginRight: '5@s',
  },

  btnLoadStargazers: {
    padding: '3@s',
    backgroundColor: CommonColors.emailText,
    borderRadius: '5@s',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  itemStargazer: {
    flexDirection: 'row',
    padding: '5@s',
    alignItems: 'center',
  },

  stargazerName: {
    fontSize: '11@s',
    textAlign: 'center',
    marginLeft: '5@s',
  },

  stargazerList: {
    minHeight: '60@s',
    backgroundColor: '#ccc',
    marginBottom: '20@s',
    padding: '20@s',
    overflow: 'hidden',
  }
})
