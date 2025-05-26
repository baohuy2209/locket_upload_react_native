/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Text, TouchableOpacity, Colors, Typography} from 'react-native-ui-lib';
import MainDialog from './MainDialog';

interface SelectMessageDialogProps {
  option: {
    title: string;
    value: string;
    color?: string;
  }[];
  isVisible: boolean;
  onDismiss: () => void;
  onSelect: (option: string) => void;
}

const SelectMessageDialog: React.FC<SelectMessageDialogProps> = ({
  option,
  isVisible,
  onSelect,
  onDismiss,
}) => {
  return (
    <MainDialog
      visible={isVisible}
      onDismiss={onDismiss}
      titleStyle={{
        color: 'white',
        ...Typography.text60BL,
        textAlign: 'center',
        width: '100%',
      }}>
      {option.map((item, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => {
            onDismiss();
            onSelect(item.value);
          }}
          style={{
            padding: 12,
            borderBottomWidth: 1,
            borderBottomColor: Colors.grey20,
          }}>
          <Text text70BL center color={item.color || 'white'}>
            {item.title}
          </Text>
        </TouchableOpacity>
      ))}
    </MainDialog>
  );
};

export default SelectMessageDialog;
