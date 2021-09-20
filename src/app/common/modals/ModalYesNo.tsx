import React, { useContext } from 'react'
import { Button, Header, Icon, Modal } from 'semantic-ui-react'
import { RootStoreContext } from '../../stores/rootStore';

interface IProps {
    handleConfirmation: (values: any) => Promise<any>;
}

const ModalYesNo : React.FC<IProps> = ({handleConfirmation}) => {
    const rootStore = useContext(RootStoreContext);
    const { closeModal } = rootStore.modalStore;
  return (
    <Modal
      closeIcon
      open = {true}
    >
      <Header icon='archive' content='Archive Old Messages' />
      <Modal.Content>
        <p>
          Your inbox is getting full, would you like us to enable automatic
          archiving of old messages?
        </p>
      </Modal.Content>
      <Modal.Actions>
        <Button color='red' onClick={() => closeModal}>
          <Icon name='remove' /> No
        </Button>
        <Button color='green' onClick={() => handleConfirmation}>
          <Icon name='checkmark' /> Yes
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

export default ModalYesNo