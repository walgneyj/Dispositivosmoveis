import { Container, Title, ButtonTypeStyleProps } from "./Button.styles";
import { TouchableOpacityProps } from "react-native";

type Props = TouchableOpacityProps & {
  title: string;
  type?: ButtonTypeStyleProps;
}

export default function Button({ title, type = "PRIMARY", ...rest }: Props) {
  return (
    <Container type={type} {...rest}>
      <Title>{title}</Title>
    </Container>
  )
}