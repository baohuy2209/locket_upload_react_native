/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import {Colors, Text, View} from 'react-native-ui-lib';
import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Linking, RefreshControl, ScrollView, ToastAndroid} from 'react-native';
import RNFS from 'react-native-fs';

import {
  // enableLocketGold,
  getAccountInfo,
  updateDisplayName,
} from '../../redux/action/user.action';
import EditTextDialog from '../../Dialog/EditTextDialog';
import Header from '../../components/Header';
import UpdatePopup from '../../Dialog/UpdatePopup';
import UserInfo from '../../components/UserInfo';
import {useRoute} from '@react-navigation/native';
import {AppDispatch, RootState} from '../../redux/store';
import ModalImageViewBlur from './components/ModalImageViewBlur';
import {t} from '../../languages/i18n';
import {
  setOptionFriend,
  setShowDonate,
  setTrySoftwareEncode,
  setUnlimitedTrimVideo,
} from '../../redux/slice/setting.slice';
import {clearTokenData} from '../../redux/slice/spotify.slice';
import {deleteAllMp4Files} from '../../util/uploadVideo';
import {clearPostMoment} from '../../redux/slice/postMoment.slice';
import {TextSwitch} from '../../components/TextSwitch';
import {setLanguage} from '../../redux/slice/language.slice';
import {Language} from '../../models/language.model';
import {logout} from '../../redux/slice/user.slice';
import {setOldPosts} from '../../redux/slice/oldPosts.slice';
import {setFriends} from '../../redux/slice/friends.slice';
import {clearListChat} from '../../redux/slice/chat.slice';
import {getSocket} from '../../services/Chat';
import ItemSwitch from './components/ItemSwitch';
import ItemButton from './components/ItemButton';
import SocialLinks from './components/SocialLinks';
import {useCodePushUpdate} from '../../hooks/useCodePushUpdate';
import {navigationTo} from '../../navigation/HomeNavigation';
import {nav} from '../../navigation/navName';

const AccountScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const params = useRoute<any>().params;
  const local_update = params?.local_update;
  const {language} = useSelector((state: RootState) => state.language);
  const {optionFriend, unlimitedTrimVideo, trySoftwareEncode, showDonate} =
    useSelector((state: RootState) => state.setting);
  const {tokenData} = useSelector((state: RootState) => state.spotify);
  const socket = getSocket();

  const {userInfo, isLoading, user, updateAvatarLoading} = useSelector(
    (state: RootState) => state.user,
  );
  const [isEditName, setisEditName] = useState(false);
  const [visibleBigAvatar, setvisibleBigAvatar] = useState(false);

  const handleRefresh = () => {
    dispatch(
      getAccountInfo({
        idToken: user?.idToken || '',
        refreshToken: user?.refreshToken || '',
      }),
    );
  };

  const handleSpotifyLogout = useCallback(() => {
    dispatch(clearTokenData());
  }, [dispatch]);

  const handleEditName = () => {
    setisEditName(!isEditName);
  };

  const onDismissEditName = () => {
    setisEditName(false);
  };

  const handleConfirmEditName = (firstName: string, lastName: string) => {
    dispatch(
      updateDisplayName({
        first_name: firstName,
        last_name: lastName,
        idToken: user?.idToken || '',
        refreshToken: user?.refreshToken || '',
      }),
    );
  };

  const handleClearCache = useCallback(async () => {
    let totalSize = 0;
    totalSize += (await deleteAllMp4Files(RNFS.DocumentDirectoryPath)) || 0;
    totalSize += (await deleteAllMp4Files(RNFS.CachesDirectoryPath)) || 0;

    dispatch(clearPostMoment());
    ToastAndroid.show(
      `${t('clean_cache_complete')} (${totalSize.toFixed(1)}Mb)`,
      ToastAndroid.SHORT,
    );
  }, [dispatch]);

  const handleUpdateAvatar = async () => {
    setvisibleBigAvatar(true);
  };
  useEffect(() => {
    if (local_update) {
      handleCodePushUpdate();
    }
  }, [local_update]);

  const {
    handleCodePushUpdate,
    onUpdate,
    updateInfo,
    decriptionUpdate,
    updateAPKInfo,
    downloadProgress,
    isPopupVisible,
    setIsPopupVisible,
  } = useCodePushUpdate();

  const handleCheckUpdateAPK = useCallback(async () => {
    Linking.openURL(updateAPKInfo.downloadUrl);
  }, [updateAPKInfo]);

  const onPostpone = useCallback(() => {
    setIsPopupVisible(false);
  }, []);

  const switches = [
    {
      value: optionFriend,
      onPress: (val: boolean) => dispatch(setOptionFriend(val)),
      title: t('multi_option_friend'),
    },
    {
      value: unlimitedTrimVideo,
      onPress: (val: boolean) => dispatch(setUnlimitedTrimVideo(val)),
      title: t('unlimited_trim_video'),
    },
    {
      value: trySoftwareEncode,
      onPress: (val: boolean) => dispatch(setTrySoftwareEncode(val)),
      title: t('use_software_encode_video'),
    },
    {
      value: !showDonate,
      onPress: (val: boolean) => dispatch(setShowDonate(val)),
      title: t('hide_donate'),
    },
  ];

  const buttons = [
    {
      title: t('friend_manager'),
      onPress: () => {
        navigationTo(nav.friend);
      },
    },
    {
      title: t('check_update_app'),
      onPress: handleCodePushUpdate,
      color: Colors.primary,
    },
    {title: t('clean_cache'), onPress: handleClearCache, color: Colors.green30},
    tokenData && {
      title: t('logout_spotify'),
      onPress: handleSpotifyLogout,
      color: Colors.spotify,
    },
    {
      title: t('logout'),
      onPress: () => {
        dispatch(logout());
        dispatch(setOldPosts([]));
        dispatch(setFriends([]));
        dispatch(clearListChat());
        socket?.disconnect();
      },
      color: Colors.red20,
    },
  ].filter(Boolean);

  return (
    <>
      <Header />
      <View flex-1 bg-black centerV paddingH-12>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={handleRefresh}
              tintColor={Colors.white}
            />
          }
          contentContainerStyle={{gap: 8}}
          showsVerticalScrollIndicator={false}>
          <View>
            <UserInfo
              dataUser={userInfo}
              handleEditName={handleEditName}
              handleUpdateAvatar={handleUpdateAvatar}
              updateAvatarLoading={updateAvatarLoading}
            />
          </View>
          <View marginT-10>
            <SocialLinks />
          </View>

          <View height={30} />
          <View
            bg-grey10
            paddingH-8
            br20
            marginB-1
            row
            spread
            paddingV-8
            centerV>
            <Text white text70BL flexS>
              {t('language')}
            </Text>
            <View width={'40%'}>
              <TextSwitch
                onChange={(val: string) => {
                  dispatch(setLanguage(val as Language));
                }}
                option={[Language.EN, Language.VI]}
                value={language}
              />
            </View>
          </View>
          {switches.map((s, idx) => (
            <ItemSwitch key={idx} {...s} />
          ))}

          <View height={10} />

          {buttons.map((b, idx) => (
            <ItemButton
              key={idx}
              onPress={b?.onPress || (() => {})}
              title={b?.title || ''}
              color={b?.color}
            />
          ))}
        </ScrollView>
      </View>

      <EditTextDialog
        visible={isEditName}
        onDismiss={onDismissEditName}
        label={t('edit_name')}
        onConfirm={handleConfirmEditName}
        isEditName={true}
        placeholder={t('first_name')}
        placeholder2={t('last_name')}
        value={userInfo?.firstName || ''}
        value2={userInfo?.lastName || ''}
        isLoading={isLoading}
      />
      <UpdatePopup
        isVisible={isPopupVisible}
        updateInfo={updateInfo || 'CHECK_UPDATE'}
        progress={downloadProgress}
        onUpdate={onUpdate}
        decriptionUpdate={decriptionUpdate}
        onPostpone={onPostpone}
        onCheckUpdate={handleCodePushUpdate}
        apkUpdateInfo={updateAPKInfo}
        onUpdateApk={handleCheckUpdateAPK}
      />
      <ModalImageViewBlur
        image={userInfo?.photoUrl || ''}
        visible={visibleBigAvatar}
        onCancel={function (): void {
          setvisibleBigAvatar(false);
        }}
      />
    </>
  );
};

export default AccountScreen;
