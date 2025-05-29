/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */

// React & React Native Imports
import React, {useCallback, useEffect, useState} from 'react';
import {Dimensions, Platform} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
  NavigationProp,
  RouteProp,
} from '@react-navigation/native';

// UI Library Imports
import {View} from 'react-native-ui-lib';

// Redux Imports
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../redux/store';
import {setMessage} from '../../redux/slice/message.slice';
import {clearPostMoment} from '../../redux/slice/postMoment.slice';
import {getOldPosts} from '../../redux/action/getOldPost.action';
import {setPostStyle} from '../../redux/slice/setting.slice';

// Firebase Imports

// Third-party Library Imports
import {showEditor} from 'react-native-video-trim';
import {Asset} from 'react-native-image-picker';
import RNFS from 'react-native-fs';

// Local Component/Util Imports
import PostForm from './PostForm';
import {nav} from '../../navigation/navName';
import {selectMedia} from '../../util/selectImage';
import {clearAppCache} from '../../util/uploadImage';
import {deleteAllMp4Files} from '../../util/uploadVideo';
import useTrimVideo from '../../hooks/useTrimVideo';
import {DefaultOverlayCreate, OverLayCreate} from '../../util/bodyMoment';
import {t} from 'i18next';
import {navigationTo, setNavigation} from '../../navigation/HomeNavigation';
import {hapticFeedback} from '../../util/haptic';
import {onPostMoment} from './functions/PostMoment';
import PostScreen from '../Moment';
import {setFilterFriendShow} from '../../redux/slice/oldPosts.slice';
import HomeScreenHeader from './HomeScreenHeader';
import HomeScreenDialogs from './dialog/HomeScreenDialogs';

// --- Type Definitions ---

interface RouteParams {
  from?: string;
  uri?: string;
  camera?: Asset;
}

interface MediaType {
  uri: string;
  type?: 'video' | 'image' | string;
}

const osVersion = {
  type: Platform.OS,
  version: Platform.Version,
};
const screenHeight = Dimensions.get('window').height;
const cropHeight = screenHeight * 0.8;

const HomeScreen = () => {
  const componentNavigation = useNavigation<NavigationProp<any>>(); // Lấy navigation từ hook
  setNavigation(componentNavigation);

  const route = useRoute<RouteProp<{params: RouteParams}>>();
  const dispatch = useDispatch<AppDispatch>();
  const {user, userInfo} = useSelector((state: RootState) => state.user);

  const trimmedVideoUri = useTrimVideo();
  const {postMoment, isLoading} = useSelector(
    (state: RootState) => state.postMoment,
  );
  const {postStyle} = useSelector((state: RootState) => state.setting);
  const {selected, optionSend, customListFriends} = useSelector(
    (state: RootState) => state.friends,
  );

  const {filterFriendShow, isLoadPosts} = useSelector(
    (state: RootState) => state.oldPosts,
  );

  // --- Component State ---
  const [selectedMedia, setSelectedMedia] = useState<MediaType | null>(null);
  const [caption, setCaption] = useState('');
  const [overlay, setOverlay] = useState<OverLayCreate>({
    ...DefaultOverlayCreate,
    postStyle: postStyle,
  });
  const [isVideo, setIsVideo] = useState(false);
  const [visibleSelectFriend, setVisibleSelectFriend] = useState(false);
  const [visibleSelectColor, setVisibleSelectColor] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState<'form' | 'screen'>('form');

  const handleScrollEnd = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const page = offsetY < screenHeight / 2 ? 'form' : 'screen';
    setCurrentPage(page);
  };
  // --- Effects ---
  // Effect xử lý kết quả trả về từ màn hình Crop hoặc Camera
  useEffect(() => {
    const unsubscribe = componentNavigation.addListener('focus', () => {
      const {params} = route;

      if (params?.from === nav.crop && params?.uri) {
        setSelectedMedia({uri: params.uri, type: 'image'});
        setIsVideo(false);
      } else if (params?.from === nav.camera && params?.camera) {
        if (params.camera.type?.startsWith('video')) {
          compressMedia(params.camera);
        } else {
          setSelectedMedia({uri: params.camera.uri ?? '', type: 'image'});
          setIsVideo(false);
        }
      }
      componentNavigation.setParams({
        from: undefined,
        uri: undefined,
      });
    });

    return unsubscribe;
  }, [componentNavigation, route]);

  // Effect chạy mỗi khi màn hình được focus: Lấy bài đăng cũ hơn
  useFocusEffect(
    useCallback(() => {
      if (
        user?.localId &&
        user.idToken &&
        user.timeExpires &&
        +user.timeExpires > new Date().getTime() &&
        !isLoadPosts
      ) {
        dispatch(
          getOldPosts({
            userId: user.localId,
            token: user.idToken,
            timestamp: new Date().getTime() / 1000,
          }),
        );
      }
    }, [user?.localId, user?.idToken, user?.timeExpires]),
  );

  // Effect xử lý sau khi đăng bài thành công
  useEffect(() => {
    if (postMoment && user?.localId) {
      dispatch(setMessage({message: postMoment, type: t('success')}));
      dispatch(clearPostMoment());
      setSelectedMedia(null);
      setCaption('');
      setOverlay({
        ...DefaultOverlayCreate,
        postStyle: postStyle,
        overlay_type: overlay.overlay_type,
      });
      setIsVideo(false);
      clearAppCache();
      dispatch(getOldPosts({userId: user.localId, token: user.idToken}));
      deleteAllMp4Files(RNFS.DocumentDirectoryPath);
    }
  }, [postMoment, dispatch, user?.localId, user?.idToken]);

  // Effect xử lý kết quả trả về từ hook cắt video
  useEffect(() => {
    if (trimmedVideoUri === 'cancel') {
      console.log('Video trimming cancelled');
      setSelectedMedia(null);
    } else if (trimmedVideoUri) {
      setSelectedMedia({uri: trimmedVideoUri, type: 'video'});
      setIsVideo(true);
    }
  }, [trimmedVideoUri]);

  // Effect cập nhật overlay khi style bài đăng thay đổi
  useEffect(() => {
    setOverlay(prevOverlay => ({
      ...prevOverlay,
      postStyle: postStyle,
    }));
  }, [postStyle]);

  // --- Event Handlers ---

  const handleViewPost = () => {
    hapticFeedback();
    navigationTo(nav.chatList);
  };

  const handleSelectMedia = async () => {
    await handleConfirmSelectMedia('gallery');
  };

  const handleRemoveMedia = () => {
    setSelectedMedia(null);
    setIsVideo(false);
  };

  const handleViewProfile = () => {
    hapticFeedback();
    navigationTo(nav.accountInfo);
  };

  const handlePost = async () => {
    onPostMoment({
      caption,
      customListFriends,
      dispatch,
      optionSend,
      overlay,
      selected,
      selectedMedia,
      user,
    });
  };

  const handleConfirmSelectMedia = async (value: 'gallery' | 'camera') => {
    setLocalLoading(true);
    await onSelectMedia(value);
    setLocalLoading(false);
  };

  const onSelectMedia = async (from: 'gallery' | 'camera') => {
    try {
      if (from === 'gallery') {
        const result = await selectMedia();
        if (result && result.length > 0 && result[0].uri) {
          compressMedia(result[0]);
        } else {
          console.log('No media selected from gallery or selection cancelled.');
        }
      } else if (from === 'camera') {
        hapticFeedback();
        navigationTo(nav.camera);
      }
    } catch (error) {
      console.error('Error selecting media:', error);
      dispatch(
        setMessage({message: t('error_select_media'), type: t('error')}),
      );
      setLocalLoading(false);
    }
  };

  const compressMedia = (media: Asset) => {
    setSelectedMedia(null);

    if (!media.uri) {
      console.warn('Selected media is missing URI.');
      return;
    }

    if (media.type?.startsWith('image')) {
      setIsVideo(false);
      hapticFeedback();
      navigationTo(nav.crop, {imageUri: media.uri});
    } else if (media.type?.startsWith('video')) {
      setIsVideo(true);
      let videouri;
      if (osVersion.type === 'android' && Number(osVersion.version) <= 29) {
        videouri = media.uri.replace('file://', '');
      } else {
        videouri = media.uri;
      }
      showEditor(videouri, {
        saveButtonText: t('save'),
        cancelButtonText: t('cancel'),
        trimmingText: t('processing'),
        autoplay: true,
        cancelDialogMessage: t('cancel_trim_video'),
        cancelDialogConfirmText: t('yes'),
        cancelDialogCancelText: t('no'),
        enableSaveDialog: false,
        enableHapticFeedback: true,
        type: 'video',
        alertOnFailToLoad: true,
      });
    } else {
      console.warn('Unsupported media type:', media.type);
      dispatch(
        setMessage({message: t('video_type_not_support'), type: t('error')}),
      );
    }
  };

  // --- Render ---
  return (
    <View flex bg-black>
      <HomeScreenHeader
        user={user}
        userInfo={userInfo}
        currentPage={currentPage}
        filterFriendShow={filterFriendShow}
        onViewProfile={handleViewProfile}
        onViewPost={handleViewPost}
        onSelectFriend={friend => dispatch(setFilterFriendShow(friend))}
      />

      {/* Body */}
      <ScrollView
        contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}
        keyboardShouldPersistTaps="handled"
        pagingEnabled
        nestedScrollEnabled
        onMomentumScrollEnd={handleScrollEnd}
        showsVerticalScrollIndicator={false}>
        <View height={cropHeight}>
          <PostForm
            selectedMedia={selectedMedia}
            isVideo={isVideo}
            onRemoveMedia={handleRemoveMedia}
            onSelectMedia={handleSelectMedia}
            caption={caption}
            setCaption={setCaption}
            isLoading={isLoading}
            onPost={handlePost}
            onSelectFriend={() => setVisibleSelectFriend(true)}
            localLoading={localLoading}
            overlay={overlay}
            setOverlay={setOverlay}
            onLongPress={() => setVisibleSelectColor(true)}
            selectedCount={
              optionSend === 'all'
                ? 0
                : optionSend === 'custom_list'
                ? customListFriends.length
                : selected.length
            }
          />
        </View>
        <View height={screenHeight * 0.87} center>
          <View
            height={4}
            width={80}
            style={{
              borderRadius: 2,
            }}
            bg-grey20
            marginB-12
          />
          <PostScreen disableScroll={currentPage === 'form'} />
        </View>
      </ScrollView>

      {/* Dialogs */}
      <HomeScreenDialogs
        visibleSelectFriend={visibleSelectFriend}
        visibleSelectColor={visibleSelectColor}
        valueColors={overlay.postStyle}
        setVisibleSelectFriend={setVisibleSelectFriend}
        setVisibleSelectColor={setVisibleSelectColor}
        onSelectColor={val => {
          dispatch(setPostStyle(val));
        }}
      />
    </View>
  );
};

export default HomeScreen;
