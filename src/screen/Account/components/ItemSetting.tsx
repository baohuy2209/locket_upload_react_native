import React from 'react';
import {
  ItemSettingModel,
  TypeItemSettingModel,
} from '../../../models/itemSetting.model';
import ItemButton from './ItemButton';
import ItemSwitch from './ItemSwitch';

interface ItemSettingProps {
  item: ItemSettingModel;
  onPress: (val?: boolean) => void;
}

const ItemSetting: React.FC<ItemSettingProps> = ({item, onPress}) => {
  if (item.type === TypeItemSettingModel.BUTTON) {
    return <ItemButton onPress={onPress} title={item.title} />;
  }

  return (
    <ItemSwitch
      onPress={onPress}
      title={item.title}
      value={item.value || false}
    />
  );
};

export default ItemSetting;
