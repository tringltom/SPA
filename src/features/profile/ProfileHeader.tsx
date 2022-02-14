import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { Segment, Item, Header, Grid } from 'semantic-ui-react';
import { RootStoreContext } from '../../app/stores/rootStore';

const ProfileHeader = () => {
  const rootStore = useContext(RootStoreContext);
  const { user } = rootStore.userStore;

  return (
    <Segment>
      <Grid>
        <Grid.Column width={12}>
          <Item.Group>
            <Item>
              <Item.Image avatar size="small" src={"/assets/user.png"} />
              <Item.Content verticalAlign="middle">
                <Header as="h1" content={user?.username}></Header>
              </Item.Content>
            </Item>
          </Item.Group>
        </Grid.Column>
        <Grid.Column width={2} verticalAlign="middle">
          <Header
            as="h1"
            content={user?.currentXp}
            subheader={"Iskustveni poeni"}
            textAlign="center"
            floated="left"
          />
          <Header
            as="h1"
            content={user?.currentLevel}
            subheader={"Nivo"}
            textAlign="center"
            floated="right"
          />
        </Grid.Column>
      </Grid>
    </Segment>
  );
};

export default observer(ProfileHeader) ;