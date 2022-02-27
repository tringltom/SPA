import { observer } from 'mobx-react-lite';
import { useContext, useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import { Button, Card, Container, Header, Image, Segment } from 'semantic-ui-react'
import ModalYesNo from '../../app/common/modals/ModalYesNo';
import { RootStoreContext } from '../../app/stores/rootStore';

const AvatarApprovals = () => {

  const rootStore = useContext(RootStoreContext);
  const { loadUsersForImageApproval, setPage, page, totalPages, userImagestoApproveArray, approveUserImage } = rootStore.userStore;
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
      <InfiniteScroll
        pageStart={0}
        loadMore={handleGetNext}
        hasMore={!loadingNext && page + 1 < totalPages}
        initialLoad={false}
      >
        {userImagestoApproveArray?.length! > 0 &&
          userImagestoApproveArray?.map((user, element) => (
            <Segment.Group key={element}>
              <Segment>
                <Header as="h2" style={{ textAlign: "center" }}>
                  {user.userName}
                </Header>
                <Card key={user?.image.id} fluid>
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
                        handleConfirmation={
                          async () => await approveUserImage(user.id, true)
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
                  content="Zabrani"
                  color="red"
                  onClick={() =>
                    openModal(
                      <ModalYesNo
                        handleConfirmation={
                          async () => await approveUserImage(user.id, false)
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
          ))}
      </InfiniteScroll>
    </Container>
  );
}

export default observer(AvatarApprovals);
