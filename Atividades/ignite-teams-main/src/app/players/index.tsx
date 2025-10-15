import { Alert, FlatList, TextInput } from "react-native";
import { useState, useEffect, useRef } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";

import { AppError } from "@/src/utils/AppError";

import Header from "@/src/components/Header";
import Highlight from "@/src/components/Highlight";
import ButtonIcon from "@/src/components/ButtonIcon";
import Input from "@/src/components/Input";
import PlayerCard from "@/src/components/PlayerCard";
import Filter from "@/src/components/Filter";
import Button from "@/src/components/Button";
import ListEmpty from "@/src/components/ListEmpty";

import playerAddByGroup from "@/src/storage/players/playerAddByGroup";
import playersGetByGroupAndTeam from "@/src/storage/players/playerGetByGroupAndTeam";
import { PlayerStorageDTO } from "@/src/storage/players/PlayerStorageDTO";
import playerRemoveByGroup from "@/src/storage/players/playerRemoveByGroup";
import groupRemoveByName from "@/src/storage/group/groupRemoveByName";

import { Container, Form, HeaderList, NumberOfPlayers } from "./Players.styles";
import Loading from "@/src/components/Loading";

export default function Players() {
  const [isLoading, setIsLoading] = useState(true);
  const [team, setTeam] = useState("time a");
  const [players, setPlayers] = useState<PlayerStorageDTO[]>([]);
  const [newPlayerName, setNewPlayerName] = useState("");
  const router = useRouter();

  const params = useLocalSearchParams();
  const group = params.group as string;

  const newPlayerNameInputRef = useRef<TextInput>(null);

  async function handleAddPlayer() {
    if (newPlayerName.trim().length === 0) {
      return Alert.alert(
        "Nova pessoa",
        "Informe o nome da pessoa para adicionar."
      );
    }

    const newPlayer = {
      name: newPlayerName,
      team,
    };

    try {
      await playerAddByGroup(newPlayer, group);
      newPlayerNameInputRef.current?.blur();

      setNewPlayerName("");

      fetchPlayersByTeam();
    } catch (error) {
      if (error instanceof AppError) {
        Alert.alert("Nova pessoa", error.message);
      } else {
        Alert.alert(
          "Nova pessoa",
          "Não foi possível adicionar uma nova pessoa."
        );
        console.log(error);
      }
    }
  }

  async function fetchPlayersByTeam() {
    try {
      setIsLoading(true);

      const playersByTeam = await playersGetByGroupAndTeam(group, team);

      setPlayers(playersByTeam);
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Pessoas",
        "Não foi possível carregar as pessoas deste time."
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handlePlayerRemove(playerName: string) {
    try {
      await playerRemoveByGroup(playerName, group);
      fetchPlayersByTeam();
    } catch (error) {
      console.log(error);
      Alert.alert("Remover pessoa", "Não foi possível remover esta pessoa.");
    }
  }

  async function groupRemove() {
    try {
      await groupRemoveByName(group);

      if (router.canGoBack()) {
        router.dismissAll();
      }
      router.replace("/");
    } catch (error) {
      console.log(error);
      Alert.alert("Remover turma", "Não foi possível remover a turma.");
    }
  }

  async function handleGroupRemove() {
    Alert.alert("Remover", "Deseja remover a turma?", [
      { text: "Não", style: "cancel" },
      { text: "Sim", onPress: () => groupRemove() },
    ]);
  }

  useEffect(() => {
    fetchPlayersByTeam();
  }, [team]);

  return (
    <Container>
      <Header showBackButton />

      <Highlight title={group} subtitle="adicione a galera e separe os times" />

      <Form>
        <Input
          inputRef={newPlayerNameInputRef}
          placeholder="Nome da pessoa"
          onChangeText={setNewPlayerName}
          value={newPlayerName}
          autoCorrect={false}
          onSubmitEditing={handleAddPlayer}
          returnKeyType="done"
        />
        <ButtonIcon icon="add" onPress={handleAddPlayer} />
      </Form>

      <HeaderList>
        <FlatList
          data={["time a", "time b", "time c"]}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Filter
              title={item}
              isActive={item === team}
              onPress={() => setTeam(item)}
            />
          )}
          horizontal
        />
        <NumberOfPlayers>{players.length}</NumberOfPlayers>
      </HeaderList>

      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={players}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <PlayerCard
              name={item.name}
              onRemove={() => handlePlayerRemove(item.name)}
            />
          )}
          contentContainerStyle={[
            { paddingBottom: 100 },
            players.length === 0 && { flex: 1 },
          ]}
          ListEmptyComponent={() => (
            <ListEmpty message="Não há pessoas nesse time" />
          )}
          showsVerticalScrollIndicator={false}
        />
      )}

      <Button
        title="Remover Turma"
        type="SECONDARY"
        onPress={handleGroupRemove}
      />
    </Container>
  );
}
