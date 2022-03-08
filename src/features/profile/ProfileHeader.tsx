import { observer } from 'mobx-react-lite';
import { useContext, useState } from 'react';
import { Segment, Item, Header, Grid, Icon, Form, Button, Container } from 'semantic-ui-react';
import { FileInput } from '../../app/common/form/FileInput';
import { RootStoreContext } from '../../app/stores/rootStore';
import { Form as FinalForm, Field } from "react-final-form";
import { combineValidators, isRequired } from 'revalidate';

const validate = combineValidators({images: isRequired({message: 'Slika je neophodna'})});

const ProfileHeader = () => {
  const rootStore = useContext(RootStoreContext);
  const { user } = rootStore.userStore;
  const { openModal } = rootStore.modalStore;
  const { setUserImage } = rootStore.profileStore;

  const [hovered, setHovered] = useState(false);

  return (
    <Segment>
      <Grid>
        <Grid.Column width={12}>
          <Item.Group>
            <Item>
              <Item.Image
                avatar
                size="small"
                src={user?.image?.url || "/assets/user.png"}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                onClick={() =>
                  openModal(
                    <Container>
                      <FinalForm
                        validate={validate}
                        onSubmit={(values) => {
                          setUserImage(values);
                        }}
                        render={({
                          handleSubmit,
                          invalid,
                          pristine,
                          submitting,
                        }) => (
                          <Form
                            autoComplete="off"
                            onSubmit={handleSubmit}
                            error
                          >
                            <Field
                              name="images"
                              component={FileInput}
                              maxNumberofFiles={1}
                            />
                            <Button
                              loading={submitting}
                              disabled={submitting || invalid || pristine}
                              color="teal"
                              content="Potvrdi"
                              type="submit"
                              fluid
                            />
                          </Form>
                        )}
                      />
                    </Container>,
                    true,
                    false
                  )
                }
                label={
                  hovered ? (
                    <Icon
                      name="add"
                      color="green"
                      size="huge"
                      style={{ position: "absolute", right: 0, top: 0 }}
                    />
                  ) : (
                    <></>
                  )
                }
              />
              <Item.Content verticalAlign="middle">
                <Header as="h1" content={user?.userName}></Header>
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