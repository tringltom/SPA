import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { Modal } from "semantic-ui-react";
import { RootStoreContext } from "../../stores/rootStore";

const ModalContainer = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    modal: { open, body, closeOnDimmerClick},
    closeModal
  } = rootStore.modalStore;

  return (
    <Modal open={open} onClose={closeModal} closeOnDimmerClick= {closeOnDimmerClick && rootStore.allowEvents} size="mini">
      <Modal.Content style={{pointerEvents: rootStore.allowEvents ? 'all' : 'none' }} >{body}</Modal.Content>
    </Modal>
  );
};

export default observer(ModalContainer);
