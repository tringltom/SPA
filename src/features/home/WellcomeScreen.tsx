import { Fragment, useContext } from 'react';
import { Button, Grid, Image, Segment } from 'semantic-ui-react';
import { RootStoreContext } from '../../app/stores/rootStore';
import LoginForm from '../user/LoginForm';
import { RegisterForm } from '../user/RegisterForm';

const WellcomeScreenImagePart = () => {
  const token = window.localStorage.getItem('jwt');
  const rootStore = useContext(RootStoreContext);
  const { openModal } = rootStore.modalStore;
  const {isLoggedIn, user} = rootStore.userStore;
    return (
      <Fragment>
        <Image id="bckGroundImg" src="/assets/BG.png" />
        <Image
          id="centerImg"
          src="/assets/Ekviti_Logo_Registracija.png"
        ></Image>
        <Grid.Column id="txtHomeScreen">
          <div >Za bolje danas!</div>
        </Grid.Column>
        <Segment id="btmContaner" inverted color="blue">
          <Segment.Inline>
            <Grid id="homeGrid" centered verticalAlign="middle" columns="equal">
              <Grid.Column width={2}>
                <Image size="big" src="/assets/Vitez_Registracija_Page.png" />
              </Grid.Column>
              <Grid.Column width={3}>
                <Button
                  onClick={() => openModal(<LoginForm />)}
                  size="massive"
                  color="violet"
                  inverted
                >
                  Uloguj se
                </Button>
              </Grid.Column>
              <Grid.Column width={3}>
                <Button
                  onClick={() => openModal(<RegisterForm />)}
                  size="massive"
                  color="violet"
                  inverted
                >
                  Registruj se
                </Button>
              </Grid.Column>
            </Grid>
          </Segment.Inline>
        </Segment>
      </Fragment>
    );
}

export default WellcomeScreenImagePart;


