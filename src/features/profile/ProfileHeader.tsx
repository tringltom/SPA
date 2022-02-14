import { observer } from 'mobx-react-lite';

import { Segment, Item, Header, Grid, Statistic } from 'semantic-ui-react';


const ProfileHeader = () => {
  // const rootStore = useContext(RootStoreContext);
  //   const {user} = rootStore.userStore;

  return (
      <Segment>
        test
      </Segment>
  )

  // return (
  //   <Segment>
  //     <Grid>
  //       <Grid.Column width={12}>
  //         <Item.Group>
  //           <Item>
  //             <Item.Image
  //               avatar
  //               size='small'
  //               src={'/assets/user.png'}
  //             />
  //             <Item.Content verticalAlign='middle'>
  //               {/* <Header as='h1'>{user?.username}</Header> */}
  //               <Header as='h1'>test</Header>
  //             </Item.Content>
  //           </Item>
  //         </Item.Group>
  //       </Grid.Column>
  //       <Grid.Column width={4}>
  //         <Statistic.Group widths={2}>
  //           {/* <Statistic label='Xp' value={user?.currentXp}/>
  //           <Statistic label='Level' value={user?.currentLevel}/> */}
  //           <Statistic label='Xp' value={5}/>
  //           <Statistic label='Level' value={5}/>
  //         </Statistic.Group>
  //       </Grid.Column>
  //     </Grid>
  //   </Segment>
  // );
};

export default observer(ProfileHeader) ;