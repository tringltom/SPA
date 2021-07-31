import { observer } from 'mobx-react-lite';
import { Button, Container, Grid, GridColumn, Menu } from 'semantic-ui-react';

const Navbar = () => {
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
                <Button positive content="Vic" inverted />
              </Menu.Item>
            </GridColumn>

            <GridColumn>
              <Menu.Item>
                <Button positive content="Izreka" inverted />
              </Menu.Item>
            </GridColumn>

            <GridColumn>
              <Menu.Item>
                <Button positive content="Zagonetka" inverted />
              </Menu.Item>
            </GridColumn>

            <GridColumn>
              <Menu.Item>
                <Button positive content="Dogadjaj" inverted />
              </Menu.Item>
            </GridColumn>

            <GridColumn>
              <Menu.Item>
                <Button positive content="Izazov" inverted />
              </Menu.Item>
            </GridColumn>

            <GridColumn floated="right">
              <Menu.Item>
                <Button color="orange" content="Nalog" fluid inverted />
              </Menu.Item>
            </GridColumn>
          </Container>
        </Menu>
      </Grid>
    );
}

export default observer(Navbar);
