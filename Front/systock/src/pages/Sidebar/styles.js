import styled from 'styled-components';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: #98B5ED;
  box-sizing: border-box;
`

export const Option = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 56px;
  background: #98B5ED;
  gap: 8px;
  &:hover {
    background: #6084C9;
  }
  padding: 0px 16px;
  box-sizing: border-box;
  cursor: pointer;
  font-weight: 600;
  font-size: 20px;
  line-height: 30px;
  color: #1E1E1E;
  & a {
    width: 100%;
    text-decoration: none;
  }
  & a:visited {
    color: inherit;
  }
`;