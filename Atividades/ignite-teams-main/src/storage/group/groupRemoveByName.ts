import AsyncStorage from "@react-native-async-storage/async-storage";

import { PLAYER_COLLECTION, GROUP_COLLECTION } from "../storageConfig";

import groupsGetAll from "./groupsGetAll";

export default async function groupRemoveByName(groupName: string) {
  try {
    const storedGroups = await groupsGetAll();
    const filteredGroups = storedGroups.filter(group => group !== groupName);

    await AsyncStorage.setItem(GROUP_COLLECTION, JSON.stringify(filteredGroups));
    await AsyncStorage.removeItem(`${PLAYER_COLLECTION}-${groupName}`);
  } catch (error) {
    throw error;
  }
}