import { Button, Card, Container, Grid, Header, Image, Segment } from 'semantic-ui-react'
import { useContext, useEffect, useState } from 'react'

import { AvatarApprovalsPlaceholder } from './AvatarApprovalsPlaceholder';
import InfiniteScroll from 'react-infinite-scroller'
import ModalYesNo from '../../app/common/modals/ModalYesNo';
import { RootStoreContext } from '../../app/stores/rootStore';
import { observer } from 'mobx-react-lite';

const AvatarApprovals = () => {

  const rootStore = useContext(RootStoreContext);
  const { loadUsersForImageApproval, setPage, page, totalPages, userImagestoApproveArray, approveUserImage, loading } = rootStore.userStore;
  const { openModal } = rootStore.modalStore;

  const [loadingNext, setLoadingNext] = useState(false);

  const handleGetNext = () => {
    setLoadingNext(true);
    setPage(page + 1);
    loadUsersForImageApproval().then(() => setLoadingNext(false));
  }

  useEffect(() => {
    loadUsersForImageApproval();
  }, [loadUsersForImageApproval]);

  return (
    <Container>
      {!loading ? (
        <InfiniteScroll
        pageStart={0}
        loadMore={handleGetNext}
        hasMore={!loadingNext && page + 1 < totalPages}
        initialLoad={false}
        >
          <Grid>
          {userImagestoApproveArray?.map((user, element) => (
            <Grid.Row centered>
            <Segment.Group key={element}>
              <Segment>
                <Header as="h2" style={{ textAlign: "center" }}>
                  {user.userName}
                </Header>
                <Card key={user?.image.id}>
                  <Image
                    circular
                    centered
                    size="large"
                    src={user?.image.url || "/assets/user.png"}
                  />
                </Card>
              </Segment>
              <Segment clearing>
                <Button
                  floated="right"
                  content="Dozvoli"
                  color="green"
                  onClick={() =>
                    openModal(
                      <ModalYesNo
                        handleConfirmation={async () =>
                          await approveUserImage(user.id, true)
                        }
                        content="Dozvoliti sliku"
                        icon="thumbs up"
                      />,
                      false
                    )
                  }
                />
                <Button
                  floated="right"
                  content="Odbij"
                  color="red"
                  onClick={() =>
                    openModal(
                      <ModalYesNo
                        handleConfirmation={async () =>
                          await approveUserImage(user.id, false)
                        }
                        content="Odbiti sliku"
                        icon="thumbs down"
                      />,
                      false
                    )
                  }
                />
              </Segment>
            </Segment.Group>
            </Grid.Row>
          ))}
        </Grid>
        </InfiniteScroll>
      ) : (
        <AvatarApprovalsPlaceholder />
      )}
    </Container>
  );
}

export default observer(AvatarApprovals);
