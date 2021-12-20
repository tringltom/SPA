import { Fragment, useContext } from 'react';
import { Button, Grid, GridColumn, Image, Segment } from 'semantic-ui-react';
import { RootStoreContext } from '../app/stores/rootStore';
import LoginForm from './user/LoginForm';
import { RegisterForm } from './user/RegisterForm';
import { EkvitiColors } from '../app/layout/EkvitiColors';
import { Link } from 'react-router-dom';


const WelcomeScreen = () => {
  const rootStore = useContext(RootStoreContext);
  const { openModal } = rootStore.modalStore;
  const { isLoggedIn, user } = rootStore.userStore;
  const token = window.localStorage.getItem('jwt');
  const ButtonStyle = {
    borderRadius: 10,
    padding: "0",
    fontSize: "max(1.1vw, 1.1em)",
    height: "3.5em",
    minWidth: "85%",
    marginLeft: "0",
  };

  const DivWithBackgroundStyle = {
    backgroundImage: "url(/assets/WelcomeBackground.png)",
    backgroundPosition: "center center",
    height: "100%",
    width: "100%",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    marginTop: "0px",
    marginLeft: "0px",
    position: "fixed",
    top: "0",
  };

  return (
    <Fragment>
      <Grid style={DivWithBackgroundStyle}>
        <Grid.Row style={{ padding: 0 }}>
          <Grid.Column verticalAlign="bottom">
            <Image
              src="/assets/RegistrationEkvitiLogo.png"
              style={{ minHeight: 30, maxHeight: 250 }}
              centered
            />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row style={{ padding: 0, position: "relative" }}>
          <Grid.Column style={{ padding: 0 }}>
            <Segment
              textAlign="center"
              style={{
                background: "transparent",
                border: 0,
                padding: 0,
                height: "60%",
                boxshadow: "none",
              }}
            >
              <h1
                className="ekvitiPrimaryFont"
                style={{
                  fontSize: 60,
                  color: EkvitiColors.primary,
                  paddingTop: 50,
                }}
              >
                Za bolje danas!
              </h1>
            </Segment>

            <Segment
              style={{
                border: 0,
                padding: 0,
                height: "40%",
                backgroundColor: "rgb(1,183,255)",
              }}
              inverted
            >
              <Grid style={{ height: "100%" }}>
                <GridColumn width={5}>
                  <Image
                    src="/assets/RegistrationKnight.png"
                    style={{
                      float: "right",
                      top: "-1.5vw",
                    }}
                  />
                </GridColumn>
                {isLoggedIn && user && token ? (
                  <GridColumn
                    width={6}
                    verticalAlign="middle"
                    textAlign="center"
                    style={{ padding: "0 1vw 0 0" }}
                  >
                    <Button
                      as={Link}
                      to="/arena"
                      size="huge"
                      color="violet"
                    >
                      Ulogovan si, pravac arena!
                    </Button>
                  </GridColumn>
                ) : (
                  <Fragment>
                    <GridColumn
                      width={3}
                      verticalAlign="middle"
                      style={{ padding: "0 1vw 0 0" }}
                    >
                      <Button
                        className="ekvitiPrimaryFont"
                        floated="right"
                        size="massive"
                        basic
                        inverted
                        style={ButtonStyle}
                        onClick={() => openModal(<LoginForm />)}
                      >
                        <p style={{ padding: "7px" }}>Prijavi se</p>
                      </Button>
                    </GridColumn>
                    <GridColumn
                      width={3}
                      verticalAlign="middle"
                      style={{ padding: "0 0 0 1vw" }}
                    >
                      <Button
                        className="ekvitiPrimaryFont"
                        floated="left"
                        size="massive"
                        style={ButtonStyle}
                        basic
                        inverted
                        onClick={() => openModal(<RegisterForm />)}
                      >
                        <p style={{ padding: "1.5px" }}>Registruj se</p>
                      </Button>
                    </GridColumn>
                  </Fragment>
                )}
              </Grid>
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Fragment>
  );
}

export default WelcomeScreen;


