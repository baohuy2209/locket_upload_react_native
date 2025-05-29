/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
// components/PostForm.tsx
import React, {useEffect, useState} from 'react';
import {
  View,
  Button,
  Colors,
  Text,
  LoaderScreen,
  TouchableOpacity,
  Icon,
} from 'react-native-ui-lib';
import ViewMedia from '../../components/ViewMedia';
import MainButton from '../../components/MainButton';
import PostPager from './PostPager';
import {OverLayCreate, OverlayType} from '../../util/bodyMoment';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import {t} from '../../languages/i18n';
import {navigationTo} from '../../navigation/HomeNavigation';
import {nav} from '../../navigation/navName';
import {requestCameraPermission} from '../../util/permission';
import {hapticFeedback} from '../../util/haptic';

interface Props {
  selectedMedia: any;
  isVideo: boolean;
  localLoading?: boolean;
  overlay: OverLayCreate;
  setOverlay?: (overlay: OverLayCreate) => void;
  onRemoveMedia: () => void;
  onSelectMedia: () => void;
  caption?: string;
  setCaption: (text: string) => void;
  isLoading: boolean;
  onPost: () => void;
  onSelectFriend: () => void;
  onLongPress?: () => void;
  selectedCount: number;
}

const PostForm: React.FC<Props> = ({
  selectedMedia,
  isVideo,
  onRemoveMedia,
  onSelectMedia,
  localLoading,
  caption,
  setCaption,
  isLoading,
  onPost,
  onSelectFriend,
  selectedCount,
  overlay,
  onLongPress,
  setOverlay,
}) => {
  const {currentPlay} = useSelector((state: RootState) => state.spotify);

  const [type, setType] = useState(OverlayType.standard);
  const [textOverlay, setTextOverlay] = useState('');

  const handlePressCamera = async () => {
    hapticFeedback();
    await requestCameraPermission();
    navigationTo(nav.camera);
  };

  useEffect(() => {
    if (setOverlay) {
      setOverlay({
        ...overlay,
        overlay_type: type,
        text: textOverlay,
        icon:
          type === OverlayType.music
            ? {
                type: 'image',
                data: currentPlay?.imageUrl || '',
                source: 'url',
              }
            : undefined,
        payload: currentPlay
          ? {
              artist: currentPlay?.artists,
              isrc: currentPlay?.isrc,
              song_title: currentPlay?.name,
              preview_url: currentPlay?.previewUrl,
              spotify_url: `https://open.spotify.com/track/${currentPlay?.id}`,
            }
          : undefined,
      });
    }
  }, [setOverlay, textOverlay, type, currentPlay]);
  return (
    <View centerV flex gap-24 padding-12>
      <ViewMedia
        selectedMedia={selectedMedia}
        isVideo={isVideo}
        onRemoveMedia={onRemoveMedia}
        onSelectMedia={onSelectMedia}
        localLoading={localLoading || false}
      />

      <PostPager
        setCaption={setCaption}
        caption={caption}
        settype={setType}
        setTextOverlay={setTextOverlay}
      />

      <Button
        label={
          !isLoading
            ? `${t('send')} (${t('to')} ${
                selectedCount > 0 ? selectedCount : t('all')
              } ${t('friends')})`
            : ''
        }
        backgroundColor={Colors.primary}
        black
        onPress={onPost}
        borderRadius={8}
        disabled={isLoading}
        text70BL>
        {isLoading && (
          <View row center>
            <Text />
            <LoaderScreen color={Colors.white} size={'small'} />
          </View>
        )}
      </Button>

      <View
        centerV
        row
        style={{
          justifyContent: 'space-around',
        }}>
        <TouchableOpacity
          padding-8
          onPress={onLongPress}
          backgroundColor={Colors.grey20}
          br30>
          <Icon
            assetName="ic_fill_color"
            size={24}
            tintColor={Colors.primary}
          />
        </TouchableOpacity>
        <MainButton label={t('select_friends')} onPress={onSelectFriend} />
        <TouchableOpacity
          padding-8
          backgroundColor={Colors.grey20}
          br30
          onPress={handlePressCamera}>
          <Icon assetName="ic_camera" size={24} tintColor={Colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PostForm;
