import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native-ui-lib';
import MainDialog from './MainDialog';
import {t} from '../languages/i18n';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../redux/store';
import {deleteMessage} from '../redux/action/chat.action';
import {ChatMessageType} from '../models/chat.model';

interface DeleteMessageDialogProps {
  visible?: boolean;
  conversationId: string;
  onDismiss?: () => void;
  message?: ChatMessageType | null;
}

const DeleteMessageDialog: React.FC<DeleteMessageDialogProps> = ({
  visible = false,
  onDismiss = () => {},
  message,
  conversationId,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector((state: RootState) => state.user.user?.idToken);
  const handleDeleteMessage = () => {
    console.log(message);

    if (message) {
      dispatch(
        deleteMessage({
          conversation_uid: conversationId,
          idToken: token || '',
          message_uid: message.id,
        }),
      );
    }
    onDismiss();
  };
  return (
    <MainDialog
      visible={visible}
      onDismiss={onDismiss}
      title={t('confirm_delete_message')}>
      <View centerV row spread paddingV-10>
        <TouchableOpacity onPress={handleDeleteMessage}>
          <Text red10 text60BL>
            {t('delete_message')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onDismiss}>
          <Text white text60BL>
            {t('cancel')}
          </Text>
        </TouchableOpacity>
      </View>
    </MainDialog>
  );
};

export default DeleteMessageDialog;
