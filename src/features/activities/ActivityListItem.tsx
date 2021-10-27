import { format } from 'date-fns';
import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Icon, Item, Label, Segment } from 'semantic-ui-react';
import { IActivity } from '../../app/models/activity';

export const ActivityListItem: React.FC<{activity: IActivity}> = ({activity}) => {
  console.log({...activity.user});
    return (
      <Segment.Group>
        <Segment>
          <Item.Group>
            <Item>
              <Item.Image size="tiny" circular src={"/assets/user.png"} style={{marginBottom: 3}} />
              <Item.Content>
                <Item.Header as={Link} to={`/activities/${activity.id}`}>{activity.title}</Item.Header>
                <Item.Description>Created by <Link to={`/profile/${activity.description}`}> {activity.answer}</Link></Item.Description>
                {activity.isHost &&
                <Item.Description>
                  <Label
                    basic
                    color="orange"
                    content="You are hosting this activity"
                  />
                </Item.Description>}
                {activity.isGoing && !activity.isHost &&
                <Item.Description>
                  <Label
                    basic
                    color="green"
                    content="You are going to this activity"
                  />
                </Item.Description>}
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
        <Segment>
          <Icon name="clock" /> {format(new Date(activity.dateCreated!), "H:mm d.M.yyyy")}
          <Icon name="marker" /> {activity.venue}, {activity.venue}
        </Segment>
        <Segment secondary>
          {activity.description}
        </Segment>
        <Segment clearing>
          <span>{activity.description}</span>
          <Button
            as={Link}
            to={`/activities/${activity.id}`}
            floated="right"
            content="Disaprove"
            color="red"
          />
          <Button
            as={Link}
            to={`/activities/${activity.id}`}
            floated="right"
            content="Approve"
            color="green"
          />
        </Segment>
      </Segment.Group>
    );
}
