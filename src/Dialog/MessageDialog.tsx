import {Text, Button, Colors, ProgressBar} from 'react-native-ui-lib';
import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {clearMessage, setTask} from '../redux/slice/message.slice';
import {ScrollView} from 'react-native';
import {AppDispatch, RootState} from '../redux/store';
import {t} from '../languages/i18n';
import MainDialog from './MainDialog';

const MessageDialog = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {message, type, hideButton, progress, task} = useSelector(
    (state: RootState) => state.message,
  );

  const handleClearMessage = () => {
    dispatch(clearMessage());
  };
  return (
    <MainDialog
      visible={!!message}
      onDismiss={handleClearMessage}
      title={type?.toUpperCase() || ''}>
      <ScrollView>
        <Text white text70BL>
          {message}
        </Text>
      </ScrollView>
      {!hideButton && (
        <Button
          label={t('close')}
          onPress={handleClearMessage}
          borderRadius={8}
          text70BL
          backgroundColor={Colors.primary}
        />
      )}
      {typeof progress === 'number' && (
        <>
          <ProgressBar progress={progress} progressColor={Colors.primary} />
        </>
      )}
      {task && type !== t('error') && type !== t('success') && (
        <Button
          label={t('cancel')}
          onPress={() => {
            if (task) {
              task.abort();
              dispatch(setTask(null));
            }
          }}
          borderRadius={8}
          text70BL
          backgroundColor={Colors.red30}
        />
      )}
    </MainDialog>
  );
};

export default MessageDialog;
