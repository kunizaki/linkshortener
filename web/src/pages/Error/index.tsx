import { BigText, BoxMessage, Container, Text } from "./styles";
import NotFoundImage from '@/assets/404.png'
import { useNavigate } from "react-router-dom";

export default function ErrorPage() {
    const navigate = useNavigate()
  return (
    <Container>
        <BoxMessage>
            <img src={NotFoundImage} alt="Não encontrado" width={300} height={200} style={{ height: 'auto' }} />
            <BigText>Link não encontrado</BigText>
            <Text fontSize={18} style={{ textAlign: 'center' }}>O link que você está tentando acessar não existe, foi removido ou é uma URL inválida. saiba mais em <div onClick={() => navigate("/")}>Encurtador de Links</div></Text>
        </BoxMessage>
    </Container>
  )
}
