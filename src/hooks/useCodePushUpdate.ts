import {useCallback, useState} from 'react';
import codePush from 'react-native-code-push';
import {useDispatch} from 'react-redux';
import {checkUpdateApk, checkVersionCodePush} from '../util/update'; // Cập nhật lại path cho đúng
import {CODEPUSH_DEPLOYMENTKEY, getStatusFromCodePush} from '../util/codepush';
import {setMessage} from '../redux/slice/message.slice';
import {t} from '../languages/i18n';
import {UpdateInfoType} from '../models/update.model';

export const useCodePushUpdate = () => {
  const dispatch = useDispatch();

  const [updateInfo, setUpdateInfo] = useState<UpdateInfoType>('CHECK_UPDATE');
  const [decriptionUpdate, setDecriptionUpdate] = useState('');
  const [updateAPKInfo, setupdateAPKInfo] = useState<any>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const handleCodePushUpdate = useCallback(async () => {
    setUpdateInfo('CHECKING_FOR_UPDATE');
    setIsPopupVisible(true);

    try {
      const apkUpdate = await checkUpdateApk();
      if (apkUpdate) {
        setupdateAPKInfo(apkUpdate);
        setDecriptionUpdate(apkUpdate?.decriptionUpdate);
        return;
      }

      const update = await codePush.checkForUpdate(CODEPUSH_DEPLOYMENTKEY());
      if (!update || (update && checkVersionCodePush(update.label))) {
        setUpdateInfo('UP_TO_DATE');
        setDecriptionUpdate('');
      } else {
        setUpdateInfo('UPDATE_AVAILABLE');
        setDecriptionUpdate(update?.description);
      }
    } catch (error: any) {
      dispatch(
        setMessage({
          message: JSON.stringify(error.message),
          type: t('error'),
        }),
      );
      setUpdateInfo('ERROR');
    }
  }, [dispatch]);

  const onUpdate = useCallback(() => {
    setUpdateInfo('DOWNLOADING_PACKAGE');
    codePush.sync(
      {
        updateDialog: undefined,
        installMode: codePush.InstallMode.IMMEDIATE,
        deploymentKey: CODEPUSH_DEPLOYMENTKEY(),
      },
      status => {
        switch (status) {
          case codePush.SyncStatus.UPDATE_INSTALLED:
          case codePush.SyncStatus.UP_TO_DATE:
            setUpdateInfo('UP_TO_DATE');
            setDecriptionUpdate('');
            break;
          case codePush.SyncStatus.UNKNOWN_ERROR:
          case codePush.SyncStatus.UPDATE_IGNORED:
            setUpdateInfo('ERROR');
            setDecriptionUpdate('');
            break;
          default:
            setUpdateInfo(getStatusFromCodePush(status));
        }
      },
      progress => {
        setDownloadProgress(progress.receivedBytes / progress.totalBytes);
      },
    );
  }, []);

  return {
    handleCodePushUpdate,
    onUpdate,
    updateInfo,
    decriptionUpdate,
    updateAPKInfo,
    downloadProgress,
    isPopupVisible,
    setIsPopupVisible,
  };
};
