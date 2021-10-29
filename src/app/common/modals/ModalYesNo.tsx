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
  return (
    <Fragment>
      <Container textAlign="left">
        <Header icon={icon} content={content} />
      </Container>
      <Divider />
      <Container textAlign="left">
        <p>Da li je ovo Vaš konačan izbor?</p>
      </Container>
      <Divider />
      <Container textAlign="right">
        <Button color="red" onClick={closeModal}>
          <Icon name="remove" /> Ne
        </Button>
        <Button color="green" loading={!rootStore.allowEvents} disabled={!rootStore.allowEvents} onClick={handleConfirmation}>
          <Icon name="checkmark" /> Da
        </Button>
      </Container>
    </Fragment>
  );
}

export default observer(ModalYesNo);