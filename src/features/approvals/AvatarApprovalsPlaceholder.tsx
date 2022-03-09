import { Button, Card, Container, Grid, Placeholder, Segment } from 'semantic-ui-react'

export const AvatarApprovalsPlaceholder = () => {
  return (
    <Container>
      <Grid>
        {[...Array(4)].map((el, i) => (
          <Grid.Row key={i} centered>
            <Placeholder key={i} fluid>
              <Segment.Group key={el}>
                <Segment>
                  <Placeholder>
                    <Placeholder.Line />
                  </Placeholder>
                  <Card key={el} fluid>
                    <Placeholder>
                      <Placeholder.Image square />
                    </Placeholder>
                  </Card>
                </Segment>
                <Segment clearing>
                  <Button
                    floated="right"
                    content="Učitava se.."
                    color="green"
                    disabled
                    loading
                  />
                  <Button
                    loading
                    floated="right"
                    content="Učitava se.."
                    color="red"
                    disabled
                  />
                </Segment>
              </Segment.Group>
            </Placeholder>
          </Grid.Row>
        ))}
      </Grid>
    </Container>
  );
}
