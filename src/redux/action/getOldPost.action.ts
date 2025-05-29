import {createAsyncThunk} from '@reduxjs/toolkit';
import {setMessage} from '../slice/message.slice';
import {
  loadPostsFromStorage,
  savePostsToStorage,
} from '../../helper/post.storage';
import {setOldPosts} from '../slice/oldPosts.slice';
import {t} from '../../languages/i18n';
import {Post} from '../../models/post.model';
import {cleanObject} from '../../util/cleanObject';
import {instanceLocket, instanceMyServer} from '../../util/axios_instance';
import {removeActiveKeyEmail} from '../slice/setting.slice';
import {decodeJwt} from '../../util/convert';
import {loginHeader} from '../../util/constrain';

interface DataParam {
  token: string;
  userId: string;
  timestamp?: number | string;
  byUserId?: string;
  isLoadMore?: boolean;
}

export const getOldPosts = createAsyncThunk(
  'getListOldPost',
  async (data: DataParam, thunkApi) => {
    try {
      console.log('running getOldPosts', data.userId);
      const oldPosts = await loadPostsFromStorage('posts_' + data.userId);
      thunkApi.dispatch(setOldPosts(oldPosts));
      const response = await instanceMyServer.post('/posts', cleanObject(data));
      const listOldPosts = response.data.post;
      return {
        post: listOldPosts,
        currentUserId: data?.userId,
        deleted: response.data?.deleted,
        isLoadMore: data?.isLoadMore,
        byUserId: data?.byUserId,
      };
    } catch (error: any) {
      if (error?.response?.status === 401) {
        const email = decodeJwt(data.token)?.email;
        thunkApi.dispatch(removeActiveKeyEmail(email));
      }
      thunkApi.dispatch(
        setMessage({
          message: `${JSON.stringify(error?.response?.data) || error.message}`,
          type: t('error'),
        }),
      );
      return thunkApi.rejectWithValue(error);
    }
  },
);

export const cleanOldPostAsync = createAsyncThunk(
  'oldPosts/cleanOldPostAsync',
  async (currentUserId: string, _) => {
    const key = 'posts_' + currentUserId;
    const data: Post[] = await loadPostsFromStorage(key);

    const postsToKeep = data.slice(0, 60);

    await savePostsToStorage(key, postsToKeep);

    return postsToKeep;
  },
);

export const getReaction = createAsyncThunk(
  'getReaction',
  async (data: {momentId: string; token: string}, thunkApi) => {
    try {
      const response = await instanceMyServer.post(
        `/posts/${data.momentId}`,
        {
          token: data.token,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      return {
        momentId: data.momentId,
        reactions: response.data.reactions,
      };
    } catch (error: any) {
      thunkApi.dispatch(
        setMessage({
          message: `${JSON.stringify(error?.response?.data) || error.message}`,
          type: t('error'),
        }),
      );
      return thunkApi.rejectWithValue(error);
    }
  },
);

interface DeleteMomentParam {
  momentId: string;
  ownerId: string;
  token: string;
  isMyMoment?: boolean;
}

export const deleteMoment = createAsyncThunk(
  'deleteMoment',
  async (data: DeleteMomentParam, thunkApi) => {
    try {
      const bodyRequest = {
        data: {
          moment_uid: data.momentId,
          owner_uid: data.ownerId,
          delete_globally: data.isMyMoment || false,
        },
      };
      await instanceLocket.post('/deleteMomentV2', bodyRequest, {
        headers: {
          ...loginHeader,
          Authorization: `Bearer ${data.token}`,
        },
      });
      return data.momentId;
    } catch (error: any) {
      thunkApi.dispatch(
        setMessage({
          message: `${JSON.stringify(error?.response?.data) || error.message}`,
          type: t('error'),
        }),
      );
      return thunkApi.rejectWithValue(error);
    }
  },
);

import RNFS from 'react-native-fs';
import {ToastAndroid} from 'react-native';
export const downloadImage = createAsyncThunk(
  'downloadImage',
  async (uri: string, thunkApi) => {
    const downloadDest = `${RNFS.PicturesDirectoryPath}/${Date.now()}.jpg`;
    try {
      await RNFS.downloadFile({
        fromUrl: uri,
        toFile: downloadDest,
        background: true,
        discretionary: true,
      });
      ToastAndroid.show(t('download_success'), ToastAndroid.SHORT);
      return downloadDest;
    } catch (error: any) {
      thunkApi.dispatch(
        setMessage({
          message: `Download failed: ${JSON.stringify(
            error.response?.data || error.message,
          )}`,
          type: t('error'),
        }),
      );
      return thunkApi.rejectWithValue(error);
    }
  },
);

export const downloadVideo = createAsyncThunk(
  'download video',
  async (uri: string, thunkApi) => {
    if (!uri) {
      return null;
    }

    //lưu vào thư mục download của thiết bị
    const downloadDest = `${
      RNFS.ExternalStorageDirectoryPath
    }/Movies/${Date.now()}.mp4`;

    //sử dụng axios để tải video về
    try {
      await RNFS.downloadFile({
        fromUrl: uri,
        toFile: downloadDest,
        background: true,
        discretionary: true,
      });
      ToastAndroid.show(t('download_success'), ToastAndroid.SHORT);
      return downloadDest;
    } catch (error: any) {
      thunkApi.dispatch(
        setMessage({
          message: `Download failed: ${JSON.stringify(
            error.response?.data || error.message,
          )}`,
          type: t('error'),
        }),
      );
      return thunkApi.rejectWithValue(error);
    }
  },
);
