/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, TouchableOpacity, Colors} from 'react-native-ui-lib';
import MainDialog from './MainDialog';
import {Post} from '../models/post.model';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../redux/store';
import {
  deleteMoment,
  downloadImage,
  downloadVideo,
} from '../redux/action/getOldPost.action';
import {setMessage} from '../redux/slice/message.slice';
import {t} from '../languages/i18n';

interface OptionMomentDialogProps {
  visible?: boolean;
  onDismiss?: () => void;
  moment: Post;
}

const OptionMomentDialog: React.FC<OptionMomentDialogProps> = ({
  visible = true,
  onDismiss = () => {},
  moment,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.user);
  const handleOptionSelect = (option: string) => {
    switch (option) {
      case ActionType.DOWNLOAD_IMAGE:
        dispatch(downloadImage(moment.thumbnail_url));
        break;
      case ActionType.DOWNLOAD_VIDEO:
        if (!moment?.video_url) {
          dispatch(
            setMessage({
              type: t('error'),
              message: t('moment_no_video_available'),
            }),
          );
          return;
        }
        dispatch(downloadVideo(moment?.video_url));
        break;
      case ActionType.DELETE_MOMENT:
        dispatch(
          deleteMoment({
            momentId: moment.canonical_uid,
            ownerId: moment.user,
            token: user?.idToken || '',
            isMyMoment: moment.user === user?.localId,
          }),
        );
        break;
      default:
        break;
    }
    onDismiss();
  };
  return (
    <MainDialog visible={visible} onDismiss={onDismiss}>
      <View>
        {
          //nếu moment có video thì hiển thị option tải video còn không có ẩn đi
          options.map((option, index) => {
            if (option.action === 'DOWNLOAD_VIDEO' && !moment?.video_url) {
              return null;
            }
            return (
              <TouchableOpacity
                key={index}
                onPress={() => handleOptionSelect(option.action)}
                style={{
                  padding: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: 'grey',
                }}>
                <Text
                  style={{textAlign: 'center'}}
                  white
                  color={option?.color}
                  text70BL>
                  {option.title}
                </Text>
              </TouchableOpacity>
            );
          })
        }
      </View>
    </MainDialog>
  );
};

//mảng option gồm tải ảnh, tải video(nếu moment có video), xóa moment

enum ActionType {
  DOWNLOAD_IMAGE = 'DOWNLOAD_IMAGE',
  DOWNLOAD_VIDEO = 'DOWNLOAD_VIDEO',
  DELETE_MOMENT = 'DELETE_MOMENT',
}
const options = [
  {
    title: t('download_image'),
    action: ActionType.DOWNLOAD_IMAGE,
  },
  {
    title: t('download_video'),
    action: ActionType.DOWNLOAD_VIDEO,
  },
  {
    title: t('delete_moment'),
    action: ActionType.DELETE_MOMENT,
    color: Colors.red10,
  },
];

export default OptionMomentDialog;
