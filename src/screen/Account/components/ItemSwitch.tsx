import React from 'react';
import {View, Text, Switch, Colors} from 'react-native-ui-lib';

interface ItemSwitchProps {
  value: boolean;
  onPress: (val: boolean) => void;
  title: string;
}

const ItemSwitch: React.FC<ItemSwitchProps> = ({value, onPress, title}) => {
  return (
    <>
      <View row spread centerV paddingV-12 bg-grey10 br30 paddingH-8>
        <Text white text70BL flexS>
          {title}
        </Text>
        <Switch
          value={value}
          onColor={Colors.primary}
          onValueChange={(val: boolean) => onPress(val)}
        />
      </View>
    </>
  );
};

export default ItemSwitch;
