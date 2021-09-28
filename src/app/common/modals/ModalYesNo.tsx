import { observer } from 'mobx-react-lite';
import React, { Fragment, useContext } from 'react'
import { Button, Container, Divider, Header, Icon} from 'semantic-ui-react'
import { RootStoreContext } from '../../stores/rootStore';

interface IProps {
  content : string,
  icon: string,
  handleConfirmation: (values: any) => Promise<any>;
}

const ModalYesNo : React.FC<IProps> = ({handleConfirmation, content, icon}) => {
    const rootStore = useContext(RootStoreContext);
    const { closeModal } = rootStore.modalStore;
    const { submitting } = rootStore.activityStore;
  return (
    <Fragment>
      <Container textAlign="left">
        <Header icon={icon} content={content} />
      </Container>
      <Divider />
      <Container textAlign="left">
        <p>Da li je ovo vaš konačan izbor?</p>
      </Container>
      <Divider />
      <Container textAlign="right">
        <Button color="red" onClick={closeModal} disabled = {submitting}>
          <Icon name="remove" /> Ne
        </Button>
        <Button color="green" loading={submitting} onClick={handleConfirmation}>
          <Icon name="checkmark" /> Da
        </Button>
      </Container>
    </Fragment>
  );
}

export default observer(ModalYesNo);