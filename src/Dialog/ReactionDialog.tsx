/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, Typography, Colors, Avatar} from 'react-native-ui-lib';
import MainDialog from './MainDialog';

interface Reaction {
  uid: string;
  name?: string;
  image?: string;
  reaction?: string;
}

interface ReactionDialogProps {
  visible: boolean;
  onDismiss: () => void;
  reaction: Reaction[];
}

const ReactionDialog: React.FC<ReactionDialogProps> = ({
  visible,
  onDismiss,
  reaction,
}) => {
  return (
    <MainDialog visible={visible} onDismiss={onDismiss}>
      {reaction.map((item, index) => (
        <View key={index} row centerV spread width={'100%'} marginT-12>
          <View row center>
            <Avatar
              source={{uri: item.image}}
              size={40}
              containerStyle={{marginRight: 8}}
            />
            <Text white text70BL>
              {item.name}
            </Text>
          </View>
          <Text
            style={{
              color: Colors.white,
              ...Typography.text60BL,
              textAlign: 'left',
            }}>
            {item.reaction}
          </Text>
        </View>
      ))}
    </MainDialog>
  );
};

export default ReactionDialog;
