import { Dropdown, Image } from 'semantic-ui-react'
import { Fragment, useContext } from 'react'

import { Link } from 'react-router-dom';
import { RootStoreContext } from '../../app/stores/rootStore';

export const NavbarRighItems = () => {
    const rootStore = useContext(RootStoreContext);
    const { logout, user } = rootStore.userStore;

    return (
      <Fragment>
        <Image
          avatar
          spaced="right"
          src={user?.image?.url || "/assets/user.png"}
        />
        <Dropdown pointing="top left" inline button text={user?.userName}>
          <Dropdown.Menu direction={"left"}>
            <Dropdown.Item
              as={Link}
              to={`/profile/${user?.id}`}
              text="Profil"
              icon="user"
            />
            <Dropdown.Item
              as={Link}
              to={`/approvals`}
              text="Odobrenja aktivnosti"
              icon="check"
            />
            <Dropdown.Item
              as={Link}
              to={`/avatarApprovals`}
              text="Odobrenja profila"
              icon="check circle"
            />
            <Dropdown.Item
              as={Link}
              to={`/happeningCompleteApprovals`}
              text="Odobrenja događaja"
              icon="check circle outline"
            />
            <Dropdown.Item
              as={Link}
              to={`/challengeCompleteApprovals`}
              text="Odobrenja izazova"
              icon="check square"
            />
            <Dropdown.Item onClick={logout} text="Odjava" icon="power" />
          </Dropdown.Menu>
        </Dropdown>
      </Fragment>
    );
}
