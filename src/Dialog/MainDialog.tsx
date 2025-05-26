/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import CustomDialog from './CustomDialog';
import {Colors, Dialog, Typography} from 'react-native-ui-lib';

interface MainDialogProps {
  visible: boolean;
  onDismiss: () => void;
  children?: React.ReactNode;
  title?: string;
  titleStyle?: object;
}

const MainDialog: React.FC<MainDialogProps> = ({
  visible,
  children,
  onDismiss,
  title,
  titleStyle = {
    color: 'white',
    ...Typography.text60BL,
    textAlign: 'left',
    width: '100%',
    lineHeight: 36,
  },
}) => {
  return (
    <CustomDialog
      visible={visible}
      onDismiss={onDismiss}
      title={title?.toUpperCase() || ''}
      panDirection={Dialog.directions.DOWN}
      titleStyle={titleStyle}
      bottom
      width={'98%'}
      maxHeight={'100%'}
      containerStyle={{
        backgroundColor: 'black',
        borderWidth: 1,
        borderBottomWidth: 0,
        borderRadiusBottomLeft: 0,
        borderRadiusBottomRight: 0,
        borderColor: Colors.grey20,
        gap: 4,
        padding: 12,
        borderRadius: 10,
        paddingBottom: 24,
      }}>
      {children}
    </CustomDialog>
  );
};

export default MainDialog;
