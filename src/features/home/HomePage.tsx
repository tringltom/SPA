import { Fragment, useContext } from "react";
import { Link } from "react-router-dom";
import { Button, Container, Header, Segment } from "semantic-ui-react";
import { RootStoreContext } from "../../app/stores/rootStore";
import { ForgotPasswordForm } from "../user/ForgotPasswordForm";
import LoginForm from "../user/LoginForm";
import { RegisterForm } from "../user/RegisterForm";

const homePageImageStyle = {
  display: "block",
  marginleft: "auto",
  marginright: "auto",
  width: "100%",
};

const HomePage = () => {
  const token = window.localStorage.getItem('jwt');
  const rootStore = useContext(RootStoreContext);
  const { openModal } = rootStore.modalStore;
  const {isLoggedIn, user} = rootStore.userStore;
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
        {isLoggedIn && user ? (
          <Fragment>
            <Button as={Link} to='/arena' size='huge' inverted color='violet'>
            Ulogovan si pravac arena
            </Button>
          </Fragment>
        ) : (
          <Fragment>
            <Button
              onClick={() => openModal(<LoginForm />)}
              size="huge"
              color="violet"
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
            <Container style={{ marginTop: "1em" }}>
              <Button
                onClick={() => openModal(<ForgotPasswordForm />)}
                size="small"
                color="blue"
              >
                Zaboravili ste šifru, a imate nalog kod nas?
              </Button>
            </Container>
          </Fragment>
        )}
      </Container>
    </Segment>
  );
};

export default HomePage
