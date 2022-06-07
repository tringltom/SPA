import { Button, Card, Container, Grid, Header, Image, Item, Label, Segment } from 'semantic-ui-react';
import React, { useContext, useEffect, useState } from 'react'

import { ChallengeAnswersPlaceholder } from './ChallengeAnswersPlaceholder';
import { IPhoto } from '../../app/models/activity';
import InfiniteScroll from 'react-infinite-scroller';
import ModalYesNo from '../../app/common/modals/ModalYesNo';
import { RootStoreContext } from '../../app/stores/rootStore';
import { RouteComponentProps } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

interface DetailParams {
    id: string;
}

const ChallengeAnswers : React.FC<RouteComponentProps<DetailParams>>= ({match}) => {
  const challengeId = match.params.id;

  const rootStore = useContext(RootStoreContext);
  const { loadChallengeAnswers, setChallengeAnswersPage, challengeAnswersPage, totalChallengeAnswerPages, challengeAnswerArray, confirmChallengeAnswer, loadingInitial } = rootStore.activityStore;
  const { openModal } = rootStore.modalStore;

  const [loadingNext, setLoadingNext] = useState(false);

  const handleGetNext = () => {
    setLoadingNext(true);
    setChallengeAnswersPage(challengeAnswersPage + 1);
    loadChallengeAnswers(challengeId).then(() => setLoadingNext(false));
  }

  useEffect(() => {
    loadChallengeAnswers(challengeId);
  }, [loadChallengeAnswers]);

  return (
    <Container>
      {!loadingInitial ? (
        <InfiniteScroll
        pageStart={0}
        loadMore={handleGetNext}
        hasMore={!loadingNext && challengeAnswersPage + 1 < totalChallengeAnswerPages}
        initialLoad={false}
        >
          <Grid>
          {challengeAnswerArray?.map((challengeAnswer, element) => (
            <Grid.Row centered key={element}>
            <Segment.Group>
            <Segment>
                <Item.Group>
                  <Item>
                    <Item.Content>
                      {challengeAnswer.confirmed && <Item.Meta><Label color='red' content="potvrdjen"/></Item.Meta>}
                      <Item.Description>
                       {challengeAnswer.description}
                      </Item.Description>
                      {challengeAnswer.challengePhotos?.map((photo: IPhoto) => (
                        <Card key={photo.id} fluid>
                          <Item.Image src={photo.url || "/assets/user.png"} />
                        </Card>
                      ))}
                    </Item.Content>
                  </Item>
                </Item.Group>
              </Segment>
              <Segment clearing>
                {!challengeAnswer.confirmed &&
                <Button
                  floated="right"
                  content="Odaberi odgovor"
                  color="blue"
                  onClick={() =>
                    openModal(
                      <ModalYesNo
                        handleConfirmation={async () =>
                          await confirmChallengeAnswer(challengeAnswer.id)
                        }
                        content="Odaberi odgovor"
                        icon="thumbs up"
                      />,
                      false
                    )
                  }
                />
                }
              </Segment>
            </Segment.Group>
            </Grid.Row>
          ))}
        </Grid>
        </InfiniteScroll>
      ) : (
        <ChallengeAnswersPlaceholder />
      )}
    </Container>
  )
}

export default observer(ChallengeAnswers);