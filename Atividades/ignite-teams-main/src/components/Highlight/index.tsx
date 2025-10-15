import { Container, Title, Subtitle } from "./Highlight.styles";

type Props = {
  title: string;
  subtitle: string;
}

export default function Highlight({ title, subtitle }: Props) {
  return (
    <Container>
      <Title>
        {title}
      </Title>
      <Subtitle>
        {subtitle}
      </Subtitle>
    </Container>
  )
}