import { Link } from 'react-router-dom';
import { Option, OptionText, Container } from './styles.js'

export default function Sidebar() {
  

  return(
    <Container>
      <Option>
        <OptionText>
          <Link to="dashboard">Dashboard</Link>
        </OptionText>
      </Option>
      <Option>
        <OptionText>
          <Link to="category">Categoria</Link>
        </OptionText>
      </Option>
      <Option>
        <OptionText>
          <Link to="product">Product</Link>
        </OptionText>
      </Option>
      <Option>
        <OptionText>
          <Link to="stock">Estoque</Link>
        </OptionText>
      </Option>
      <Option>
        <OptionText>
        <Link to="settings">Configurações</Link>
        </OptionText>
      </Option>
    </Container>
  );
}