import {ActionCreatorWithPayload} from '@reduxjs/toolkit';

export interface ItemSettingModel {
  title: string;
  value?: boolean;
  action: string;
  type?: TypeItemSettingModel;
  useDispatch?: boolean;
}

export type ActionItemSettingModel =
  | ((value: boolean) => void)
  | (() => void)
  | (() => Promise<void>)
  | ActionCreatorWithPayload<boolean>;

export enum TypeItemSettingModel {
  SWITCH = 'switch',
  BUTTON = 'button',
  TOGGLE = 'toggle',
  TEXT = 'text',
  INPUT = 'input',
  SELECT = 'select',
  MULTI_SELECT = 'multi_select',
  CUSTOM = 'custom',
}
