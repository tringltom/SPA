import { observer } from 'mobx-react-lite';
import React from 'react';
import { Segment, Item, Header, Button, Grid, Statistic } from 'semantic-ui-react';
import { IUser } from '../../app/models/user';

interface IProps {
    user: IUser | null;
}


const ProfileHeader:React.FC<IProps> = ({user}) => {
  return (
    <Segment>
      <Grid>
        <Grid.Column width={12}>
          <Item.Group>
            <Item>
              <Item.Image
                avatar
                size='small'
                src={'/assets/user.png'}
              />
              <Item.Content verticalAlign='middle'>
                <Header as='h1'>{user?.username}</Header>
              </Item.Content>
            </Item>
          </Item.Group>
        </Grid.Column>
        <Grid.Column width={4}>
          <Statistic.Group widths={2}>
            <Statistic label='Xp' value={user?.currentXp}/>
            <Statistic label='Level' value={user?.currentLevel}/>
          </Statistic.Group>
        </Grid.Column>
      </Grid>
    </Segment>
  );
};

export default observer(ProfileHeader) ;