import {createAsyncThunk} from '@reduxjs/toolkit';
import {getListFriend, getListIdFriend} from '../../util/friends';
import {setMessage} from '../slice/message.slice';
import {t} from '../../languages/i18n';
import {setActiveKey} from '../slice/setting.slice';
import {instanceLocket, instanceMyServer} from '../../util/axios_instance';
import {loginHeader} from '../../util/constrain';
import {fetchUser} from '../../api/user.api';
import {Friend} from '../../models/friend.model';

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
      if (response.data?.users?.length === 0) {
        return [];
      }

      const friends = await Promise.all(
        response.data.users.map(
          async (item: any) => await fetchUser(item, data.idToken),
        ),
      );

      return friends.map(friend => friend.data.result.data as Friend);
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

export const acceptFriendRequest = createAsyncThunk(
  'acceptFriendRequest',
  async (data: {idToken: string; uid: string}, thunkApi) => {
    try {
      const body = {
        data: {
          user_uid: data.uid,
        },
      };
      const response = await instanceLocket.post('/acceptFriendRequest', body, {
        headers: {
          Authorization: `Bearer ${data.idToken}`,
          ...loginHeader,
        },
      });

      if (response.data?.result?.data?.user_uid === data.uid) {
        const friend = await fetchUser(data.uid, data.idToken);
        return friend.data.result.data as Friend;
      } else {
        thunkApi.dispatch(
          setMessage({
            message: response.data?.result?.message || t('error'),
            type: t('error'),
          }),
        );
        return thunkApi.rejectWithValue(response.data);
      }
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

export const rejectFriendRequest = createAsyncThunk(
  'rejectFriendRequest',
  async (data: {idToken: string; uid: string}, thunkApi) => {
    try {
      const body = {
        data: {
          user_uid: data.uid,
          direction: 'outgoing',
        },
      };
      const response = await instanceLocket.post('/deleteFriendRequest', body, {
        headers: {
          Authorization: `Bearer ${data.idToken}`,
          ...loginHeader,
        },
      });
      if (response.data?.result?.data === null) {
        return data.uid;
      } else {
        thunkApi.dispatch(
          setMessage({
            message: response.data?.result?.message || t('error'),
            type: t('error'),
          }),
        );
        return thunkApi.rejectWithValue(response.data);
      }
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

export const removeFriend = createAsyncThunk(
  'removeFriend',
  async (data: {idToken: string; uid: string}, thunkApi) => {
    try {
      const body = {
        data: {
          user_uid: data.uid,
        },
      };
      const response = await instanceLocket.post('/removeFriend', body, {
        headers: {
          Authorization: `Bearer ${data.idToken}`,
          ...loginHeader,
        },
      });

      if (response.data?.result?.data?.user_uid === data.uid) {
        return data.uid;
      } else {
        thunkApi.dispatch(
          setMessage({
            message: response.data?.result?.message || t('error'),
            type: t('error'),
          }),
        );
        return thunkApi.rejectWithValue(response.data);
      }
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
