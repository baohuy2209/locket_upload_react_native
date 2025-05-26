/* eslint-disable no-async-promise-executor */
import {fetchUser} from '../api/user.api';
import {Friend} from '../models/friend.model';
import {t} from '../languages/i18n';
import {User} from '../models/user.model';
import {instanceMyServer} from './axios_instance';

export const getListIdFriend = async (token: string) => {
  const response = await instanceMyServer.post('/listen', {
    token,
  });
  return response.data.users;
};

export const getListFriend = (
  token: string,
  listIdFriend: string[],
): Promise<Record<string, Friend>> => {
  const friendPromises = listIdFriend.map(friendId => {
    return new Promise<Friend>(async (resolve, reject) => {
      try {
        const response = await fetchUser(friendId, token);
        const data = response.data.result.data as Friend;

        if (data && data.uid) {
          resolve(data);
        } else {
          reject(new Error(`Friend data for ${friendId} is invalid.`));
        }
      } catch (error) {
        reject(error);
      }
    });
  });

  return Promise.all(friendPromises)
    .then(friends => {
      const friendMap: Record<string, Friend> = {};
      for (const friend of friends) {
        friendMap[friend.uid] = friend;
      }
      return friendMap;
    })
    .catch(error => {
      console.error('Error fetching friends:', error.response?.data || error);
      throw error;
    });
};

export const filterFriends = (
  friends: {
    [key: string]: Friend;
  },
  uid: string,
  myProfile?: User | null,
) => {
  if (!myProfile) {
    return null;
  }
  const find = friends[uid];
  if (!find && myProfile.localId === uid) {
    return {
      first_name: t('you'),
      profile_picture_url: myProfile?.photoUrl,
      uid: myProfile?.localId,
    };
  }
  return find ? find : null;
};

export const shouldRefreshToken = (
  timeExpires: number,
  bufferMinutes = 5,
): boolean => {
  const now = Date.now() + 15 * 60 * 1000; // add 15 minutes drift
  const expires = timeExpires || 0;
  return expires < now + bufferMinutes * 60 * 1000;
};
