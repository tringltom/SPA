import { Fragment, useContext } from 'react'
import { Link } from 'react-router-dom';
import { Dropdown, Image } from 'semantic-ui-react'
import { RootStoreContext } from '../../app/stores/rootStore';

export const NavbarRighItems = () => {
    const rootStore = useContext(RootStoreContext);
    const { logout, user } = rootStore.userStore;

    return (
      <Fragment>
        <Image
          avatar
          spaced="right"
          src={user?.image || "/assets/user.png"}
        />
        <Dropdown pointing="top left" inline button text={user?.username}>
          <Dropdown.Menu direction={"left"}>
            <Dropdown.Item
              as={Link}
              to={`/profile/${user?.username}`}
              text="Profil"
              icon="user"
            />
            <Dropdown.Item
              as={Link}
              to={`/approvals`}
              text="Odobrenja"
              icon="check"
            />
            <Dropdown.Item onClick={logout} text="Odjava" icon="power" />
          </Dropdown.Menu>
        </Dropdown>
      </Fragment>
    );
}
