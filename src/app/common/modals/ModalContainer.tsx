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
    <Modal open={open} onClose={closeModal} closeOnDimmerClick= {closeOnDimmerClick} size="mini">
      <Modal.Content>{body}</Modal.Content>
    </Modal>
  );
};

export default observer(ModalContainer);
