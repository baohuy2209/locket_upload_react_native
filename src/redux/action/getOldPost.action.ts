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
import {instanceMyServer} from '../../util/axios_instance';
import {setActiveKey} from '../slice/setting.slice';

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
        thunkApi.dispatch(setActiveKey(null));
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
