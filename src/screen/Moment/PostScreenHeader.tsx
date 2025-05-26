/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Friend} from '../../models/friend.model';
import Header from '../../components/Header';
import FriendPicker from './FriendPicker';
import {Colors, Icon, TouchableOpacity} from 'react-native-ui-lib';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import {ActivityIndicator} from 'react-native';

interface PostScreenHeaderProps {
  friends: {
    [key: string]: Friend;
  };
  user: any;
  filterFriendShow: Friend | null;
  setFilterFriendShow: (friend: Friend | null) => void;
  leftIconAction?: () => void;
  rightIconAction?: () => void;
}

const PostScreenHeader: React.FC<PostScreenHeaderProps> = ({
  friends,
  user,
  filterFriendShow,
  setFilterFriendShow,
  leftIconAction,
  rightIconAction,
}) => {
  const {isLoadingActionMoment} = useSelector(
    (state: RootState) => state.oldPosts,
  );
  return (
    <Header
      customCenter={
        <FriendPicker
          friends={friends}
          onSelect={setFilterFriendShow}
          user={user}
          value={filterFriendShow}
        />
      }
      backgroundColor={Colors.transparent}
      leftIconAction={leftIconAction}
      customRight={
        isLoadingActionMoment ? (
          <ActivityIndicator size="small" color={Colors.white} />
        ) : (
          rightIconAction && (
            <TouchableOpacity
              onPress={rightIconAction}
              style={{
                borderRadius: 8,
                padding: 6,
                backgroundColor: Colors.grey20,
              }}>
              <Icon assetName="ic_action" size={24} tintColor={Colors.grey40} />
            </TouchableOpacity>
          )
        )
      }
    />
  );
};

export default PostScreenHeader;
