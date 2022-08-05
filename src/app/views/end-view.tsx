import styled from "styled-components";
import { EmptyButton } from "../components/buttons";

const Container = styled.div`
  position: absolute;
  max-width: 22em;
  width: 40%;
  left: 50%;
  transform: translateX(-50%);
`;
const StyledP = styled.p`
  font-size: 1em;
  text-align: center;
`;

const RefreshPage = styled(EmptyButton)`
  background: #d9d9d9;
  width: 100%;
  height: 1.8em;
  font-size: 1.2em;
  font-weight: bold;
  margin: auto;
  margin-top: 0.5em;
`;

const EndRetroView = () => {
  return (
    <Container>
      <StyledP>
        This retro is now concluded. Refresh the page to create a new one.
      </StyledP>
      <RefreshPage
        onClick={() => {
          location.hash = "";
          location.reload();
        }}>
        🚀 Refresh page
      </RefreshPage>
    </Container>
  );
};

export default EndRetroView;
