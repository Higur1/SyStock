import { Link } from 'react-router-dom';
import { Option, OptionText, Container } from './styles.js'

export default function Sidebar() {
  

  return(
    <Container>
      <Option>
          <Link to="dashboard">Dashboard</Link>
      </Option>
      <Option>
          <Link to="category">Categoria</Link>
      </Option>
      <Option>
          <Link to="product">Product</Link>
      </Option>
      <Option>
          <Link to="stock">Estoque</Link>
      </Option>
      <Option>
        <Link to="settings">Configurações</Link>
      </Option>
    </Container>
  );
}