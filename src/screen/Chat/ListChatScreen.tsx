import React, {useCallback} from 'react';
import {Text, View} from 'react-native-ui-lib';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../redux/store';
import {FlatList, RefreshControl} from 'react-native';
import {ListChatType} from '../../models/chat.model';
import ItemListChat from './ItemListChat';
import Header from '../../components/Header';
import {t} from '../../languages/i18n';

import {nav} from '../../navigation/navName';
import {useListChat} from './hooks/useListChat';
import {navigationTo} from '../../navigation/HomeNavigation';
import {hapticFeedback} from '../../util/haptic';
import {getMessage} from '../../redux/action/chat.action';

interface ListChatScreenProps {}

const ListChatScreen: React.FC<ListChatScreenProps> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {listMessages, isLoadChat} = useListChat();
  const token = useSelector((state: RootState) => state.user.user?.idToken);
  const {friends} = useSelector((state: RootState) => state.friends);

  const handlePressItem = useCallback(
    (item: ListChatType) => {
      hapticFeedback();
      navigationTo(nav.chat, {
        uid: item.uid,
        friend: friends[item.with_user],
      });
    },
    [friends],
  );

  const handleRefresh = useCallback(() => {
    if (isLoadChat && token) {
      dispatch(getMessage(token || ''));
    }
  }, [dispatch, isLoadChat, token]);

  const renderItem = useCallback(
    ({item}: {item: ListChatType}) =>
      item.uid ? (
        <ItemListChat itemChat={item} onPress={() => handlePressItem(item)} />
      ) : null,
    [handlePressItem],
  );

  return (
    <View flex bg-black>
      <Header title={t('chat')} />
      <View height={20} />
      <FlatList
        data={listMessages}
        refreshControl={
          <RefreshControl refreshing={isLoadChat} onRefresh={handleRefresh} />
        }
        keyExtractor={item => item.uid}
        renderItem={renderItem}
        removeClippedSubviews
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={5}
        updateCellsBatchingPeriod={50}
        ListEmptyComponent={
          <View flex center>
            <Text white text70BL>
              {t('not_thing_here')}
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default ListChatScreen;
