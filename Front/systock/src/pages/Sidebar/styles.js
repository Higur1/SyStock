import styled from 'styled-components';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

export const CustomArrow = styled(ChevronLeftIcon)`
  position: absolute;
  top: 8px;
  right: 16px;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  background: #98B5ED;
  position: relative;
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
  box-sizing: border-box;
  cursor: pointer;
  font-weight: 600;
  font-size: 20px;
  line-height: 30px;
  color: #1E1E1E;
  padding-left: 16px;
  & a {
    width: 100%;
    text-decoration: none;
  }
  & a:visited {
    color: inherit;
  }
`;