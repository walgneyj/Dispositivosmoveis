import { useRouter } from "expo-router";
import { Container, Logo, BackButton, BackIcon } from "./Header.styles";

import logoImg from "@/assets/images/logo.png";

type Props = {
  showBackButton?: boolean;
}

export default function Header({ showBackButton = false }: Props) {
  const router = useRouter();

  return (
    <Container>
      {
        showBackButton &&
        <BackButton onPress={() => router.back()}>
          <BackIcon />
        </BackButton>
      }

      <Logo source={logoImg} />
    </Container>
  )
}