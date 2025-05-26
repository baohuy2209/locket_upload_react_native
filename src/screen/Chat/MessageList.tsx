/* eslint-disable react-native/no-inline-styles */
import React, {useRef, forwardRef, useImperativeHandle, useState} from 'react';
import {
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ToastAndroid,
} from 'react-native';
import {ChatMessageType} from '../../models/chat.model';
import ItemMessage from './ItemMessage';
import {Colors, Text, TouchableOpacity} from 'react-native-ui-lib';
import {t} from '../../languages/i18n';
import SelectMessageDialog from '../../Dialog/SelectMessageDialog';
import Clipboard from '@react-native-clipboard/clipboard';
import DeleteMessageDialog from '../../Dialog/DeleteMessageDialog';

interface Props {
  messages: ChatMessageType[];
  currentUserId?: string;
  ListFooterComponent?: React.ComponentType<any> | React.ReactElement | null;
  onLoadMore?: () => void;
  conversationId: string;
}

const MessageList = forwardRef<FlatList<ChatMessageType>, Props>(
  (
    {messages, currentUserId, ListFooterComponent, onLoadMore, conversationId},
    ref,
  ) => {
    const flatListRef = useRef<FlatList<ChatMessageType>>(null);
    const [isAtBottom, setIsAtBottom] = useState(true);
    const [messageSelect, setmessageSelect] = useState<ChatMessageType | null>(
      null,
    );
    const [visibleDeleteMessage, setvisibleDeleteMessage] = useState(false);
    const [visibleSelectMessage, setVisibleSelectMessage] = useState(false);

    useImperativeHandle(
      ref,
      () => flatListRef.current as FlatList<ChatMessageType>,
      [],
    );

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const {contentOffset} = event.nativeEvent;
      const threshold = 20; // tweak nếu cần
      setIsAtBottom(contentOffset.y <= threshold);
    };

    const handleLongPress = (message: ChatMessageType) => {
      setVisibleSelectMessage(true);
      setmessageSelect(message);
    };

    const handleOptionSelect = (value: string) => {
      if (value === 'copy') {
        Clipboard.setString(messageSelect?.text || '');
        ToastAndroid.show(t('copy_success'), ToastAndroid.SHORT);
      } else if (value === 'delete') {
        setvisibleDeleteMessage(true);
      } else {
        setmessageSelect(null);
      }
    };

    return (
      <>
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item, index) => item.id || index.toString()}
          renderItem={({item, index}) => (
            <ItemMessage
              item={item}
              sendByMe={item.sender === currentUserId}
              previousItem={
                index < messages.length - 1 ? messages[index + 1] : undefined
              }
              nextItem={index > 0 ? messages[index - 1] : undefined}
              onLongPress={handleLongPress}
            />
          )}
          inverted
          contentContainerStyle={{flexGrow: 1}}
          ListFooterComponent={ListFooterComponent}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={false}
          onScroll={handleScroll}
          onEndReached={onLoadMore}
          onEndReachedThreshold={0.9}
          scrollEventThrottle={100}
        />
        {!isAtBottom && (
          <TouchableOpacity
            onPress={() => {
              flatListRef.current?.scrollToOffset({offset: 0, animated: true});
            }}
            style={{
              position: 'absolute',
              bottom: 80,
              right: 16,
              backgroundColor: Colors.blue,
              padding: 8,
              borderRadius: 20,
            }}>
            <Text style={{color: 'white'}}>{t('new_message')}</Text>
          </TouchableOpacity>
        )}
        <SelectMessageDialog
          isVisible={visibleSelectMessage}
          onDismiss={() => setVisibleSelectMessage(false)}
          onSelect={handleOptionSelect}
          option={options.filter(option => {
            if (option.value === 'delete') {
              return messageSelect?.sender === currentUserId;
            }
            return true;
          })}
        />
        <DeleteMessageDialog
          visible={visibleDeleteMessage}
          message={messageSelect}
          onDismiss={() => setvisibleDeleteMessage(false)}
          conversationId={conversationId}
        />
      </>
    );
  },
);

const options = [
  {title: t('copy'), value: 'copy'},
  {title: t('delete'), value: 'delete', color: Colors.red30},
  {title: t('cancel'), value: 'cancel'},
];

MessageList.displayName = 'MessageList';
export default MessageList;
