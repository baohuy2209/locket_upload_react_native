import {createAsyncThunk} from '@reduxjs/toolkit';
import {getListFriend, getListIdFriend} from '../../util/friends';
import {setMessage} from '../slice/message.slice';
import {t} from '../../languages/i18n';
import {setActiveKey} from '../slice/setting.slice';
import {instanceMyServer} from '../../util/axios_instance';

interface DataParam {
  idToken: string;
}

export const getFriends = createAsyncThunk(
  'getListFriend',
  async (data: DataParam, thunkApi) => {
    try {
      const listFriendId = await getListIdFriend(data.idToken);
      const listFriend = await getListFriend(data.idToken, listFriendId);
      return listFriend;
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

export const getIncommingFriend = createAsyncThunk(
  'getIncommingFriend',
  async (data: DataParam, thunkApi) => {
    try {
      const response = await instanceMyServer.post('friends/incomming', {
        token: data.idToken,
      });
      return response.data;
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
