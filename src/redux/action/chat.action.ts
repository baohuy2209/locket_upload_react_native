import {createAsyncThunk} from '@reduxjs/toolkit';
import {setMessage} from '../slice/message.slice';
import {t} from '../../languages/i18n';
import {generateUUIDv4} from '../../util/chat';
import {loginHeader} from '../../util/constrain';
import {instanceLocket, instanceMyServer} from '../../util/axios_instance';

interface DataParam {
  idToken: string;
  receiver_uid?: string | null;
  msg: string;
  moment_uid?: string | null;
  from_memory?: boolean;
}

export const sendMessage = createAsyncThunk(
  'sendMessage',
  async (data: DataParam, thunkApi) => {
    try {
      const {idToken, receiver_uid, msg, moment_uid} = data;
      const body = {
        data: {
          receiver_uid,
          moment_uid,
          msg,
          client_token: generateUUIDv4(),
          from_memory: true,
        },
      };
      const response = await instanceLocket.post('sendChatMessageV2', body, {
        headers: {
          Authorization: `Bearer ${idToken}`,
          ...loginHeader,
        },
      });
      return response.data;
    } catch (error: any) {
      thunkApi.dispatch(
        setMessage({
          message: `${JSON.stringify(error?.response?.data) || error.message}`,
          type: t('error'),
        }),
      );

      return thunkApi.rejectWithValue(
        error?.response?.data?.error || error.message,
      );
    }
  },
);

export const getMessage = createAsyncThunk(
  'getMessage',
  async (token: string, thunkApi) => {
    try {
      const body = {
        token,
      };
      const response = await instanceMyServer.post('/message', body);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        setMessage({
          message: error.response.data,
          type: t('error'),
        });
      } else {
        thunkApi.dispatch(
          setMessage({
            message: `${
              JSON.stringify(error?.response?.data) || error.message
            }`,
            type: t('error'),
          }),
        );
      }
      return thunkApi.rejectWithValue(
        error?.response?.data?.error || error.message,
      );
    }
  },
);

interface GetMessageWithParam {
  token: string;
  conversation_uid: string;
  timestamp?: string;
}

export const getMessageWith = createAsyncThunk(
  'getMessageWith',
  async (data: GetMessageWithParam, thunkApi) => {
    try {
      const body = {
        token: data.token,
        timestamp: data?.timestamp,
      };
      const response = await instanceMyServer.post(
        `/message/${data.conversation_uid}`,
        body,
      );
      return {
        uid: data.conversation_uid,
        chat: response.data?.message,
        isLoadMore: data.timestamp ? true : false,
      };
    } catch (error: any) {
      thunkApi.dispatch(
        setMessage({
          message: `${JSON.stringify(error?.response?.data) || error.message}`,
          type: t('error'),
        }),
      );
      return thunkApi.rejectWithValue(
        error?.response?.data?.error || error.message,
      );
    }
  },
);

export const markReadMessage = createAsyncThunk(
  'markReadMessage',
  async (data: {idToken: string; conversation_uid: string}, thunkApi) => {
    try {
      const {idToken, conversation_uid} = data;
      const body = {
        data: {
          conversation_uid,
        },
      };
      const response = await instanceLocket.post('markAsRead', body, {
        headers: {
          Authorization: `Bearer ${idToken}`,
          ...loginHeader,
        },
      });
      return response.data;
    } catch (error: any) {
      thunkApi.dispatch(
        setMessage({
          message: `${JSON.stringify(error?.response?.data) || error.message}`,
          type: t('error'),
        }),
      );
      return thunkApi.rejectWithValue(
        error?.response?.data?.error || error.message,
      );
    }
  },
);

interface DeleteMessageParam {
  idToken: string;
  conversation_uid: string;
  message_uid: string;
}
export const deleteMessage = createAsyncThunk(
  'deleteMessage',
  async (data: DeleteMessageParam, thunkApi) => {
    try {
      const body = {
        data: {
          message_uid: data.message_uid,
          conversation_uid: data.conversation_uid,
        },
      };
      const response = await instanceLocket.post('deleteChatMessage', body, {
        headers: {
          Authorization: `Bearer ${data.idToken}`,
          ...loginHeader,
        },
      });

      if (response.data?.result?.status === 200) {
        return {
          conversation_uid: data.conversation_uid,
          message_uid: data.message_uid,
        };
      } else {
        thunkApi.dispatch(
          setMessage({
            message:
              response.data?.error?.message || response.data?.result?.errors
                ? JSON.stringify(
                    response.data?.error?.message ||
                      response.data?.result?.error,
                  )
                : t('error'),
            type: t('error'),
          }),
        );
        return thunkApi.rejectWithValue(
          response.data?.result?.message || t('error'),
        );
      }
    } catch (error: any) {
      thunkApi.dispatch(
        setMessage({
          message: `${JSON.stringify(error?.response?.data) || error.message}`,
          type: t('error'),
        }),
      );
      return thunkApi.rejectWithValue(
        error?.response?.data?.error || error.message,
      );
    }
  },
);
