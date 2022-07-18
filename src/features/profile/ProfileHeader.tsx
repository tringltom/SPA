import { Button, Container, Form, Grid, Header, Icon, Item, Segment } from 'semantic-ui-react';
import { Field, Form as FinalForm } from "react-final-form";
import { combineValidators, isRequired } from 'revalidate';
import { useContext, useState } from 'react';
import { FileInput } from '../../app/common/form/FileInput';
import { RootStoreContext } from '../../app/stores/rootStore';
import { observer } from 'mobx-react-lite';


const validate = combineValidators({images: isRequired({message: 'Slika je neophodna'})});

const ProfileHeader = () => {
  const rootStore = useContext(RootStoreContext);
  const { openModal } = rootStore.modalStore;
  const { setUserImage } = rootStore.profileStore;
  const { isProfileOwner, userProfile } = rootStore.userStore;

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
                src={userProfile?.image?.url || "/assets/user.png"}
                onMouseEnter={() => {
                  if (isProfileOwner) setHovered(true);
                }}
                onMouseLeave={() => {
                  if (isProfileOwner) setHovered(false);
                }}
                onClick={() => {
                  if (isProfileOwner)
                    openModal(
                      <Container>
                        <FinalForm
                          validate={validate}
                          onSubmit={(values) => {
                            setUserImage(values);
                          }}
                          render={({ handleSubmit, invalid, pristine }) => (
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
                                loading={!rootStore.allowEvents}
                                disabled={
                                  !rootStore.allowEvents || invalid || pristine
                                }
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
                    );
                }}
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
                <Header as="h1" content={userProfile?.userName}></Header>
              </Item.Content>
            </Item>
          </Item.Group>
        </Grid.Column>
        <Grid.Column width={2} verticalAlign="middle">
          <Header
            as="h1"
            content={userProfile?.currentXp}
            subheader={"Iskustveni poeni"}
            textAlign="center"
            floated="left"
          />
          <Header
            as="h1"
            content={userProfile?.currentLevel}
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