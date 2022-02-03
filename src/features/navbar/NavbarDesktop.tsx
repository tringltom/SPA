import React from 'react'
import { Menu, Container, Grid, GridColumn, Button} from 'semantic-ui-react'
import { history } from "../../index";

interface IProps {
    leftItems: any,
    rightItems: any
  }

export const NavbarDesktop: React.FC<IProps> = ({ leftItems, rightItems }) => {
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
            {leftItems.map((item: any) => (
              <GridColumn key={item.key + "gc"}>
                <Menu.Item key={item.key + "mi"}>
                  <Button positive inverted {...item} />
                </Menu.Item>
              </GridColumn>
            ))}
            <GridColumn floated="right" className="navUserDropDown">
              <Menu.Menu position="right" style={{ alignItems: "center" }}>
                {rightItems}
              </Menu.Menu>
            </GridColumn>
          </Container>
        </Menu>
      </Grid>
    );
}
