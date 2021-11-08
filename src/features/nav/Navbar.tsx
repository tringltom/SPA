import React, { useContext } from 'react'
import { observer } from 'mobx-react-lite';
import { Button, Container, Dropdown, Grid, GridColumn, Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { RootStoreContext } from '../../app/stores/rootStore';
import  '../../app/layout/styles.css';
import { history } from "../..";

const Navbar: React.FC = () => {

  const rootStore = useContext(RootStoreContext);
  const {logout} = rootStore.userStore;

    return (
      <Grid>
        <Menu fixed="top" inverted>
         
          <Container>
            <GridColumn>
              <Menu.Item header>
                <img
                  src="/assets/littleOne.png"
                  alt=""
                  style={{ marginRight: 10 }}
                />
                Ekviti
              </Menu.Item>
            </GridColumn>
            <GridColumn>
              <Menu.Item>
                <Button positive content="Delo" inverted />
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
                <Button positive content="Izazov" inverted />
              </Menu.Item>
            </GridColumn>

            <GridColumn floated="right" className="navUserDropDown">
              <Dropdown pointing="top" inline button text="Nalog">
                <Dropdown.Menu direction={"left"}>
                  <Dropdown.Item
                    as={Link}
                    to={`/settings`}
                    text="Podešavanja"
                    icon="user"
                  />
                  <Dropdown.Item onClick={logout} text="Odjava" icon="power" />
                </Dropdown.Menu>
              </Dropdown>
            </GridColumn>
          </Container>
        </Menu>
      </Grid>
    );
}

export default observer(Navbar);
