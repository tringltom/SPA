import { useContext } from 'react'
import { Button, Container, Header, Segment } from 'semantic-ui-react'
import { RootStoreContext } from '../../app/stores/rootStore';
import LoginForm from '../user/LoginForm';
import { RegisterForm } from '../user/RegisterForm';

const homePageImageStyle = {
    display: "block",
    marginleft: "auto",
    marginright: "auto",
    width: "100%"
  };

export const HomePage = () => {
    const rootStore  = useContext(RootStoreContext);
    const {openModal} = rootStore.modalStore;
    return (
      <Segment textAlign="center" vertical className="masthead">
        <Container background="blue">
          <div>
            <img
              src={"/assets/uS.jpeg"}
              alt="noPicture"
              style={homePageImageStyle}
            />
          </div>
          <Header as="h2" content="Ekviti - za bolje danas" />
          <Button
            onClick={() => openModal(<LoginForm />)}
            size='huge'
            color='violet'
            inverted
          >
            Uloguj se
          </Button>
          <Button
            onClick={() => openModal(<RegisterForm />)}
            size="huge"
            color="violet"
            inverted
          >
            Registruj se
          </Button>
        </Container>
      </Segment>
    );
}
