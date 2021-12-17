import React from 'react';
import { Segment, Item, Header, Button, Grid, Statistic } from 'semantic-ui-react';
import { IUser } from '../../app/models/user';

interface IProps {
    user: IUser;
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
                <Header as='h1'>{user.username}</Header>
              </Item.Content>
            </Item>
          </Item.Group>
        </Grid.Column>
        <Grid.Column width={4}>
          <Statistic.Group widths={2}>
            <Statistic label='Xp' value='1001'/>
            <Statistic label='Level' value='1'/>
          </Statistic.Group>
        </Grid.Column>
      </Grid>
    </Segment>
  );
};

export default ProfileHeader;