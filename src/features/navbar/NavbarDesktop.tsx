import React, { useContext } from 'react'
import { observer } from 'mobx-react-lite';
import { Button, Container, Dropdown, Grid, GridColumn, Menu, Image} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { RootStoreContext } from '../../app/stores/rootStore';
import  '../../app/layout/styles.css';
import { history } from "../../index";

interface IProps {
  leftItems: any,
  rightItems: any
}

const NavbarDesktop: React.FC<IProps> = ({ leftItems, rightItems }) => {

  const rootStore = useContext(RootStoreContext);
  const {logout, user} = rootStore.userStore;

    return (
      <Grid>
        <Menu fixed="top" inverted>
         
          <Container>
            <GridColumn>
              <Menu.Item header>
                <img 
                  onClick={() => history.push("/arena")}
                  src="/assets/littleOne.png"
                  alt=""
                  style={{ marginRight: 10, cursor:'pointer'}}
                />
                Ekviti
              </Menu.Item>
            </GridColumn>
            <GridColumn>
              <Menu.Item>
                <Button icon="heartbeat" onClick={() => history.push("/gooddeed")} positive content="Delo" inverted />
              </Menu.Item>
            </GridColumn>
            <GridColumn>
              <Menu.Item>
              <Button icon="smile outline" onClick={() => history.push("/joke")} positive content="Vic" inverted />
              </Menu.Item>
            </GridColumn>
            <GridColumn>
              <Menu.Item>
                <Button icon="comment alternate" onClick={() => history.push("/quote")} positive content="Izreka" inverted />
              </Menu.Item>
            </GridColumn>
            <GridColumn>
              <Menu.Item>
                <Button icon="puzzle piece" onClick={() => history.push("/puzzle")} positive content="Zagonetka" inverted />
              </Menu.Item>
            </GridColumn>
            <GridColumn>
              <Menu.Item>
                <Button icon="address card outline" onClick={() => history.push("/happening")} positive content="Dogadjaj" inverted />
              </Menu.Item>
            </GridColumn>
            <GridColumn>
              <Menu.Item>
                <Button icon="hand rock" onClick={() => history.push("/challenge")} positive content="Izazov" inverted />
              </Menu.Item>
            </GridColumn>
        
            <GridColumn floated="right" className="navUserDropDown">
            <Image avatar spaced='right' src={user?.image || '/assets/user.png'} />
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
                    to={`/settings`}
                    text="Podešavanja"
                    icon="cog"
                  />
                  <Dropdown.Item as={Link} to={`/approvals`} text="Odobrenja" icon="check" />
                  <Dropdown.Item onClick={logout} text="Odjava" icon="power" />
                </Dropdown.Menu>
              </Dropdown>
            </GridColumn>
          </Container>
        </Menu>
      </Grid>
    );
}

export default observer (NavbarDesktop);


