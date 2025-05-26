import {Colors, View} from 'react-native-ui-lib';
import React, {useEffect, useState} from 'react';
import MainButton from '../components/MainButton';
import MainInput from '../components/MainInput';
import {t} from '../languages/i18n';
import MainDialog from './MainDialog';

interface EditTextDialogProps {
  value: string;
  value2?: string;
  visible: boolean;
  onDismiss: () => void;
  label: string;
  isLoading: boolean;
  onConfirm: (text: string, text2: string) => void;
  isEditName?: boolean;
  placeholder?: string;
  placeholder2?: string;
}

const EditTextDialog = ({
  value,
  value2 = '',
  visible,
  onDismiss,
  label,
  isLoading,
  onConfirm,
  isEditName = false,
  placeholder,
  placeholder2,
}: EditTextDialogProps) => {
  const [text, setText] = useState<string>(value);
  const [text2, setText2] = useState<string>(value2 || '');

  useEffect(() => {
    setText(value);
    setText2(value2);
  }, [value, value2]);

  return (
    <MainDialog visible={visible} onDismiss={onDismiss} title={label}>
      <View gap-12>
        <MainInput
          value={text}
          onChangeText={setText}
          placeholder={placeholder}
          placeholderTextColor={Colors.grey40}
        />
        {isEditName && (
          <MainInput
            value={text2}
            onChangeText={setText2}
            placeholder={placeholder2}
            placeholderTextColor={Colors.grey40}
          />
        )}
        <MainButton
          label={t('update')}
          onPress={() => {
            onConfirm(text, text2);
          }}
          isLoading={isLoading}
        />
      </View>
    </MainDialog>
  );
};

export default EditTextDialog;
