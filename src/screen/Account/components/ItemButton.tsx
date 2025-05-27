import React from 'react';
import {View, Text, TouchableOpacity, Colors, Icon} from 'react-native-ui-lib';

interface ItemButtonProps {
  title: string;
  onPress: () => void;
  assetsName?: string;
  color?: string;
}

const ItemButton: React.FC<ItemButtonProps> = ({
  title,
  onPress,
  assetsName,
  color,
}) => {
  return (
    <>
      <TouchableOpacity onPress={() => onPress()}>
        <View
          row
          centerV
          spread
          paddingV-12
          paddingH-8
          br30
          backgroundColor={color || Colors.grey10}>
          <View row centerV>
            {assetsName && (
              <Icon
                assetName={assetsName}
                size={24}
                tintColor={Colors.grey40}
                marginR-8
              />
            )}
            <Text
              color={!color ? Colors.white : Colors.black}
              text70BL
              flexS
              numberOfLines={2}>
              {title}
            </Text>
          </View>
          <Icon
            assetName="ic_next"
            size={24}
            tintColor={!color ? Colors.grey40 : Colors.black}
          />
        </View>
      </TouchableOpacity>
    </>
  );
};

export default ItemButton;
