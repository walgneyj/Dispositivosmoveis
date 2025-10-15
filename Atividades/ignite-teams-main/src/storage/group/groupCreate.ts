import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppError } from '@/src/utils/AppError';

import { GROUP_COLLECTION } from '../storageConfig';

import groupsGetAll from './groupsGetAll';

export default async function groupCreate(newGroupName: string) {
  try {
    const storedGroups = await groupsGetAll();

    const groupAlreadyExists = storedGroups.includes(newGroupName);

    if (groupAlreadyExists) {
      throw new AppError('Já existe uma turma cadastrada com esse nome.');
    }

    const storage = JSON.stringify([...storedGroups, newGroupName]);
    await AsyncStorage.setItem(GROUP_COLLECTION, storage);

  } catch (error) {
    throw error;
  }
}