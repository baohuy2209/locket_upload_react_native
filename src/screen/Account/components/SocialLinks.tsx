import React, {useCallback} from 'react';
import {View, Text, TouchableOpacity, Icon, Colors} from 'react-native-ui-lib';
import {hapticFeedback} from '../../../util/haptic';
import {Linking} from 'react-native';

interface SocialLinksProps {}

const SocialLinks: React.FC<SocialLinksProps> = () => {
  const handlePressGithub = useCallback(() => {
    hapticFeedback();
    Linking.openURL('https://github.com/quockhanh2004');
  }, []);

  const handlePressFacebook = useCallback(() => {
    hapticFeedback();
    Linking.openURL('https://www.facebook.com/profile.php?id=61575901494417');
  }, []);
  return (
    <View gap-20 row center>
      <TouchableOpacity onPress={handlePressGithub}>
        <View center row gap-8>
          <Icon
            assetGroup="icons"
            assetName="ic_github"
            tintColor={Colors.grey30}
            size={20}
          />
          <Text grey30>quockhanh2004</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={handlePressFacebook}>
        <View center row gap-8>
          <Icon
            assetGroup="icons"
            assetName="ic_facebook"
            tintColor={Colors.grey30}
            size={20}
          />
          <Text grey30>Locket Upload</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default SocialLinks;
