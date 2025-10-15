import { useState } from "react";

import { Container, Content, Icon } from "./NewGroup.styles";
import Header from "@/src/components/Header";
import Highlight from "@/src/components/Highlight";
import Button from "@/src/components/Button";
import Input from "@/src/components/Input";
import { useRouter } from "expo-router";
import groupCreate from "@/src/storage/group/groupCreate";
import { AppError } from "@/src/utils/AppError";
import { Alert } from "react-native";

export default function NewGroup() {
  const [group, setGroup] = useState("");
  const router = useRouter();

  async function handleNewGroup() {
    try {
      if (group.trim().length === 0) {
        return Alert.alert('Nova turma', 'Informe o nome da turma');
      }

      await groupCreate(group);

      router.push({
        pathname: "/players",
        params: { group },
      });
    } catch (error) {
      if (error instanceof AppError) {
        Alert.alert('Nova turma', error.message);
      } else {
        Alert.alert('Nova turma', 'Não foi possível criar uma nova turma.');
        console.log(error);
      }
    }
  }

  return (
    <Container>
      <Header showBackButton />

      <Content>
        <Icon />

        <Highlight
          title="Nova Turma"
          subtitle="Crie a turma para adicionar as pessoas"
        />

        <Input placeholder="Nome da turma" onChangeText={setGroup} />

        <Button
          title="Criar"
          style={{ marginTop: 20 }}
          onPress={handleNewGroup}
        />
      </Content>
    </Container>
  );
}
