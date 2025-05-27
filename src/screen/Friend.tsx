import React from 'react';
import {View, Text, TouchableOpacity, Icon} from 'react-native-ui-lib';
import Header from '../components/Header';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/store';
import {FlatList} from 'react-native';
import CustomAvatar from '../components/Avatar';
import {t} from '../languages/i18n';

interface FriendScreenProps {}

const FriendScreen: React.FC<FriendScreenProps> = () => {
  const friendsObject = useSelector(
    (state: RootState) => state.friends.friends,
  );
  const friends = Object.values(friendsObject);
  return (
    <View flex bg-black>
      <Header />
      <View height={20} />
      <View paddingH-20 paddingV-10 bg-black>
        <FlatList
          data={friends}
          ListHeaderComponent={
            <View row centerV spread marginB-10>
              <Text white text50BL>
                {t('friends')} ({friends.length})
              </Text>
            </View>
          }
          renderItem={({item}) => {
            return (
              <View spread row>
                <View row centerV gap-10>
                  <CustomAvatar
                    url={item.profile_picture_url}
                    text={`${item.first_name?.at(0)}${item.last_name?.at(0)}`}
                    size={42}
                  />
                  <Text white text60BL>
                    {item.first_name} {item.last_name}
                  </Text>
                </View>
                <TouchableOpacity>
                  <Icon assetName="ic_cancel" size={24} />
                </TouchableOpacity>
              </View>
            );
          }}
          keyExtractor={item => item.uid}
          // eslint-disable-next-line react/no-unstable-nested-components
          ItemSeparatorComponent={() => <View height={20} />}
        />
      </View>
    </View>
  );
};

export default FriendScreen;
