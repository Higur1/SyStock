import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  background: #98B5ED;
`

export const Option = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 56px;
  background: #98B5ED;
  &:hover {
    background: #6084C9;
  }
  cursor: pointer;
`;

export const OptionText = styled.div`
  font-weight: 600;
  font-size: 20px;
  line-height: 30px;
  color: #1E1E1E;
  padding-left: 16px;
  & a {
    text-decoration: none;
  }
  & a:visited {
    color: inherit;
  }
  
`;