import { useState, useEffect, use, useCallback } from "react";
import { FlatList } from "react-native";

import GroupCard from "../GroupCard";
import Header from "../Header";
import Highlight from "../Highlight";
import ListEmpty from "../ListEmpty";

import { Container } from "./Groups.styles";
import Button from "../Button";

import { Link, useFocusEffect, useRouter } from "expo-router";
import groupsGetAll from "@/src/storage/group/groupsGetAll";
import Loading from "../Loading";

export default function Groups() {
  const [isLoading, setIsLoading] = useState(true);
  const [groups, setGroups] = useState<string[]>([]);

  const router = useRouter();

  async function fetchGroups() {
    try {
      setIsLoading(true);

      const data = await groupsGetAll();

      setGroups(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleOpenGroup(group: string) {
    router.push({
      pathname: "/players",
      params: { group },
    });
  }

  useFocusEffect(
    useCallback(() => {
      fetchGroups();
    }, [])
  );

  return (
    <Container>
      <Header />

      <Highlight title="Turmas" subtitle="Jogue com a sua turma" />

      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={groups}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <GroupCard title={item} onPress={() => handleOpenGroup(item)} />
          )}
          contentContainerStyle={groups.length === 0 && { flex: 1 }}
          ListEmptyComponent={() => (
            <ListEmpty message="Que tal cadastrar a primeira turma?" />
          )}
        />
      )}

      <Link href="/newGroup" asChild>
        <Button title="Criar nova turma" />
      </Link>
    </Container>
  );
}
