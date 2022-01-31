import React from 'react'
import { Menu, Grid, Container, GridColumn, Dropdown } from 'semantic-ui-react';

interface IProps {
    leftItems: any,
    rightItems: any
  }

export const NavbarMobile: React.FC<IProps> = ({leftItems,rightItems,}) => {
  return (
    <Grid>
      <Menu fixed="top" inverted>
        <Container>
          <GridColumn>
            <Menu.Item>
              <img
                src="/assets/littleOne.png"
                alt=""
                style={{ marginRight: 20 }}
              />
              <Dropdown pointing="top left" inline icon="sidebar">
                <Dropdown.Menu>
                  {leftItems.map((item: any) => (
                    <Dropdown.Item
                      key={item.key + "gc"}
                      {...item}
                    ></Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </Menu.Item>
          </GridColumn>
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
