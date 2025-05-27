/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React, {useEffect, useCallback} from 'react';
import {View, Text, TouchableOpacity, Icon} from 'react-native-ui-lib';
import {FlatList} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../redux/store';

import Header from '../components/Header';
import CustomAvatar from '../components/Avatar';
import {t} from '../languages/i18n';
import {
  acceptFriendRequest,
  getIncommingFriend,
  rejectFriendRequest,
  removeFriend,
} from '../redux/action/friend.action';
import {useNavigation} from '@react-navigation/native';

const FriendScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const {user} = useSelector((state: RootState) => state.user);
  const {friends: friendsObject, friendRequests: friendRequestsObject} =
    useSelector((state: RootState) => state.friends);

  const friends = Object.values(friendsObject);
  const friendRequests = Object.values(friendRequestsObject);

  const handleAcceptFriend = useCallback(
    (friendId: string) => {
      if (!user?.idToken) {
        return;
      }
      dispatch(
        acceptFriendRequest({
          idToken: user.idToken,
          uid: friendId,
        }),
      );
    },
    [dispatch, user?.idToken],
  );

  const handleDeleteFriend = useCallback(
    (friendId: string) => {
      if (!user?.idToken) {
        return;
      }
      dispatch(
        removeFriend({
          idToken: user.idToken,
          uid: friendId,
        }),
      );
    },
    [dispatch, user?.idToken],
  );

  const handleRejectRequest = useCallback(
    (friendId: string) => {
      if (!user?.idToken) {
        return;
      }
      dispatch(
        rejectFriendRequest({
          idToken: user.idToken,
          uid: friendId,
        }),
      );
    },
    [dispatch, user?.idToken],
  );

  useEffect(() => {
    if (user?.idToken) {
      dispatch(getIncommingFriend({idToken: user.idToken}));
    }
  }, [dispatch, user?.idToken]);

  const FriendRequestItem = React.memo(({item}: any) => (
    <View spread row paddingV-10 centerV>
      <View row centerV gap-10>
        <CustomAvatar
          url={item.profile_picture_url}
          text={`${item.first_name?.[0]}${item.last_name?.[0]}`}
          size={42}
        />
        <Text white text70BL>
          {item.first_name} {item.last_name}
        </Text>
      </View>
      <View row gap-10>
        <TouchableOpacity onPress={() => handleRejectRequest(item.uid)}>
          <Icon assetName="ic_cancel" size={24} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleAcceptFriend(item.uid)}>
          <View padding-4 br100 bg-primary>
            <Icon assetName="ic_check" size={16} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  ));

  const FriendItem = React.memo(({item}: any) => (
    <View spread row centerV paddingV-10>
      <View row centerV gap-10>
        <CustomAvatar
          url={item.profile_picture_url}
          text={`${item.first_name?.[0]}${item.last_name?.[0]}`}
          size={42}
        />
        <Text white text70BL>
          {item.first_name} {item.last_name}
        </Text>
      </View>
      <TouchableOpacity onPress={() => handleDeleteFriend(item.uid)}>
        <Icon assetName="ic_cancel" size={24} />
      </TouchableOpacity>
    </View>
  ));

  return (
    <View flex bg-black>
      <Header
        leftIconAction={() => {
          navigation.goBack();
        }}
        title={t('friends')}
      />
      <View
        paddingH-20
        paddingV-10
        style={{
          flex: friendRequests.length > 9 ? 10 : friendRequests.length + 1,
        }}>
        <View row centerV spread marginB-10>
          <Text white text60BL>
            {t('friends_request')} ({friendRequests.length})
          </Text>
        </View>
        <FlatList
          data={friendRequests}
          keyExtractor={item => item.uid}
          renderItem={({item}) => <FriendRequestItem item={item} />}
        />
      </View>

      <View paddingH-20 paddingV-10 style={{flex: 10}}>
        <View row centerV spread marginB-10>
          <Text white text60BL>
            {t('friends')} ({friends.length})
          </Text>
        </View>
        <FlatList
          data={friends}
          keyExtractor={item => item.uid}
          renderItem={({item}) => <FriendItem item={item} />}
        />
      </View>
    </View>
  );
};

export default FriendScreen;
