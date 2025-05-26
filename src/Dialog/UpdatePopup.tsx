import React, {useMemo} from 'react';
import {View, Colors, ProgressBar, Text} from 'react-native-ui-lib';
import MainButton from '../components/MainButton';
import {t} from '../languages/i18n';
import {UpdateInfoType} from '../models/update.model';
import MainDialog from './MainDialog';

interface UpdatePopupProps {
  isVisible: boolean;
  updateInfo: UpdateInfoType;
  apkUpdateInfo?: {
    latestVersion: string;
    downloadUrl: string;
    updateInfo: UpdateInfoType;
  };
  progress?: number;
  onUpdate: () => void;
  onUpdateApk: () => void;
  decriptionUpdate?: string;
  onCheckUpdate: () => void;
  onPostpone: () => void;
}

const UpdatePopup = ({
  isVisible,
  updateInfo,
  apkUpdateInfo,
  progress,
  onUpdate,
  onUpdateApk,
  decriptionUpdate,
  onCheckUpdate,
  onPostpone,
}: UpdatePopupProps) => {
  const progressPercent = progress ? Math.floor(progress * 100) : 0;

  // Xác định trạng thái hiển thị ProgressBar
  const showProgress =
    updateInfo === 'DOWNLOADING_PACKAGE' || updateInfo === 'INSTALLING_UPDATE';

  const updateState = useMemo(
    () => ({
      CHECKING_FOR_UPDATE: {
        message: t('checking_for_update'),
        buttons: null,
      },
      UPDATE_AVAILABLE: {
        message: t('update_avaliable'),
        buttons: (
          <MainButton
            label={t('update')}
            onPress={onUpdate}
            isLoading={false}
          />
        ),
      },
      DOWNLOADING_PACKAGE: {
        message: `${t('downloading')}: ${progressPercent}%`,
        buttons: null,
      },
      INSTALLING_UPDATE: {
        message: t('installing_update'),
        buttons: null,
      },
      UP_TO_DATE: {
        message: t('up_to_date'),
        buttons: (
          <MainButton
            label={t('close')}
            onPress={onPostpone}
            isLoading={false}
          />
        ),
      },
      UPDATE_INSTALLED: {
        message: t('update_complete'),
        buttons: (
          <MainButton
            label={t('close')}
            onPress={onPostpone}
            isLoading={false}
          />
        ),
      },
      ERROR: {
        message: t('error_checking_for_update'),
        buttons: (
          <MainButton
            label={t('close')}
            onPress={onPostpone}
            isLoading={false}
          />
        ),
      },
      CHECK_UPDATE: {
        message: t('check_update'),
        buttons: (
          <MainButton
            label={t('check')}
            onPress={onCheckUpdate}
            isLoading={false}
          />
        ),
      },
      APK_UPDATE_AVAILABLE: {
        message: t('apk_update_avaliable'),
        buttons: (
          <MainButton
            label={t('update_apk')}
            onPress={onUpdateApk}
            isLoading={false}
          />
        ),
      },
    }),
    [onUpdate, progressPercent, onPostpone, onCheckUpdate, onUpdateApk],
  );

  // Cập nhật UI khi updateInfo thay đổi
  const {message, buttons} = apkUpdateInfo
    ? updateState[apkUpdateInfo.updateInfo as UpdateInfoType]
    : updateState[updateInfo] || updateState.UP_TO_DATE;

  return (
    <MainDialog visible={isVisible} onDismiss={onPostpone} title={message}>
      <View bg-black padding-20 paddingT-0>
        {decriptionUpdate && (
          <View paddingB-12>
            <Text white text70BL>
              {t('update_info')}:
            </Text>
            <Text white> - {decriptionUpdate}</Text>
          </View>
        )}
        {showProgress && (
          <ProgressBar
            progress={progressPercent}
            progressColor={Colors.primary}
          />
        )}
        <View center gap-12>
          {buttons && <View center>{buttons}</View>}
        </View>
      </View>
    </MainDialog>
  );
};

export default UpdatePopup;
