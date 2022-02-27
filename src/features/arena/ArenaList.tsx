import { observer } from 'mobx-react-lite';
import React from 'react'
import { Button, Icon, Item, Segment, Statistic, StatisticGroup } from 'semantic-ui-react';
import { IUser } from '../../app/models/user';

interface IProps {
    users: IUser[] | null ;
}

const ArenaList: React.FC<IProps> = ({users}) => {
    return (
      <Segment clearing>
        <Item.Group divided>
          {users?.length! > 0 &&
            users?.map((user, element) => (
              <Item key={element}>
                <Item.Image
                  size="tiny"
                  avatar
                  circular
                  centered
                  src={user?.image?.url || "/assets/user.png"}
                  style={{ marginBottom: 3 }}
                />

                <Item.Content>
                  <Item.Header as="a">{user.userName}</Item.Header>
                  <Item.Meta>
                    Trenutni broj iskustvenih poena : {user?.currentXp}
                  </Item.Meta>
                  <Item.Meta>Nivo korisnika : {user?.currentLevel}</Item.Meta>
                  <Item.Description>
                    <StatisticGroup widths={6}>
                      <Statistic>
                        <Statistic.Value>
                          <Icon name="heartbeat" />
                          {user?.numberOfGoodDeeds}
                        </Statistic.Value>
                        <Statistic.Label>Dela</Statistic.Label>
                      </Statistic>
                      <Statistic>
                        <Statistic.Value>
                          <Icon name="smile outline" />
                          {user?.numberOfJokes}
                        </Statistic.Value>
                        <Statistic.Label>Šala</Statistic.Label>
                      </Statistic>
                      <Statistic>
                        <Statistic.Value>
                          <Icon name="comment alternate" />
                          {user?.numberOfQuotes}
                        </Statistic.Value>
                        <Statistic.Label>Citat</Statistic.Label>
                      </Statistic>
                      <Statistic>
                        <Statistic.Value>
                          <Icon name="puzzle piece" />
                          {user?.numberOfPuzzles}
                        </Statistic.Value>
                        <Statistic.Label>Zagonetke</Statistic.Label>
                      </Statistic>
                      <Statistic>
                        <Statistic.Value>
                          <Icon name="address card outline" />
                          {user?.numberOfHappenings}
                        </Statistic.Value>
                        <Statistic.Label>Dogadjaj</Statistic.Label>
                      </Statistic>
                      <Statistic>
                        <Statistic.Value>
                          <Icon name="hand rock" />
                          {user?.numberOfChallenges}
                        </Statistic.Value>
                        <Statistic.Label>Izazov</Statistic.Label>
                      </Statistic>
                    </StatisticGroup>
                  </Item.Description>
                  <Item.Extra>
                    <Button floated="right" content="Pogledaj" color="blue" />
                  </Item.Extra>
                </Item.Content>
              </Item>
            ))}
        </Item.Group>
      </Segment>
    );
}

export default observer(ArenaList) ;
