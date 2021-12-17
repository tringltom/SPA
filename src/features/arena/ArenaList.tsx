import React from 'react'
import { Button, Item, Label, Segment } from 'semantic-ui-react';

interface IProps {
    users: string[]
}

const ArenaList: React.FC<IProps> = ({users}) => {
    return (
      <Segment clearing>
        <Item.Group divided>
          {users.map((user) => (
            <Item key={user}>
                <Item.Image
                size="tiny"
                circular
                centered
                src="/assets/littleOne2.jpg"
                style={{ marginBottom: 3 }}
              />
              <Item.Content>
                <Item.Header as="a">{user}</Item.Header>
                <Item.Meta>{user.length}</Item.Meta>
                <Item.Description>
                  <div>Dodatna polja opis</div>
                  <div>Dodatna polja opis</div>
                </Item.Description>
                <Item.Extra>
                  <Button floated="right" content="Pogledaj" color="blue" />
                  <Label basic content="Zanimljivost" />
                </Item.Extra>
              </Item.Content>
            </Item>
          ))}
        </Item.Group>
      </Segment>
      
    );
}

export default ArenaList;
