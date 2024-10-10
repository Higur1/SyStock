import styled from 'styled-components';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: #98B5ED;
  box-sizing: border-box;
`

export const Option = styled("div")(({selected}) => ({
  display: "flex",
  alignItems: "center",
  width: "100%",
  height: "56px",
  background: selected === "false" ? "#98B5ED" : "#6084C9",
  gap: "8px",
  "&:hover": {
    background: "#6084C9",
  },
  padding: "0px 16px",
  boxSizing: "border-box",
  cursor: "pointer",
  fontWeight: 600,
  fontSize: "20px",
  lineHeight: "30px",
  color: "#1E1E1E",
  "& a": {
    width: "100%",
    textDecoration: "none",
  },
  "& a:visited": {
    color: "inherit",
  }
}));