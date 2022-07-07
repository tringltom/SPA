import { ActivityTypes, IActivity } from '../../app/models/activity';
import { Button, Dropdown, DropdownItemProps, Icon, Input, Loader, Pagination, Table } from 'semantic-ui-react';
import React, { Fragment, useContext, useEffect, useState } from 'react'

import { RootStoreContext } from '../../app/stores/rootStore';
import { observer } from 'mobx-react-lite';
import { debounce } from 'lodash';

interface IProps {
    userId: string;
  }

const ProfileFavoriteActivities: React.FC<IProps> = ({ userId }) => {
    const rootStore = useContext(RootStoreContext);    
    const { resolveFavoriteActivity, resolvingFavourite } = rootStore.favoriteStore;
  
    const {
        loadingInitial,
        setFavoritedActivitiesPage,
        favoritedActivitiesPage,
        totalFavoritedActivitiyPages,
        favoritedActivitiesArray,
        loadFavoritedActivitiesForUser,
        setPredicate,
        setUserId
    } = rootStore.profileStore;    

    setUserId(Number(userId))

    const updateQuery = (e: any) => setPredicate("title", e.target.value)
    const handleSearch = debounce(updateQuery, 500)

    const [loadingNext, setLoadingNext] = useState(false);

    const handleClick = (activity: any) => {        
        resolveFavoriteActivity(activity, false)
    }
    
    useEffect(() => {
        setFavoritedActivitiesPage(0);
        loadFavoritedActivitiesForUser(Number(userId));        
    }, [setFavoritedActivitiesPage, loadFavoritedActivitiesForUser, userId, resolvingFavourite]);    

    const handleGetNext = (data: any) => {
        setLoadingNext(true);
        setFavoritedActivitiesPage(data.activePage - 1);
        loadFavoritedActivitiesForUser(Number(userId)).then(() => setLoadingNext(false));
    }

    const options = Object.keys(ActivityTypes).map((key: any, el) => {
        if (ActivityTypes[el + 1] !== undefined)
          return {key: key, text: ActivityTypes[el + 1], value: Number(key)}
        return undefined
      }).filter(f => f !== undefined);

    return (
      <Fragment>
        <Dropdown
          style={{ float: "right", marginBottom: "1em" }}
          placeholder="Aktivnosti"
          multiple
          selection
          options={options as DropdownItemProps[]}
          onChange={(e, { value }) =>
            setPredicate("activityTypesArray", value?.toString() ?? "")
          }
        />
        <Input
          style={{ float: "right", marginBottom: "1em", marginRight: "1em" }}
          icon="spinner"
          iconPosition="left"
          placeholder="Pretraži aktivnosti..."
          onChange={handleSearch}
        />
        {loadingInitial && !loadingNext ? (
          <Loader active inline="centered" />
        ) : (
          <Table celled textAlign="center">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Tip</Table.HeaderCell>
                <Table.HeaderCell>Naziv</Table.HeaderCell>                
                <Table.HeaderCell>Broj loših ocena</Table.HeaderCell>
                <Table.HeaderCell>Broj neutralnih ocena</Table.HeaderCell>
                <Table.HeaderCell>Broj dobrih ocena</Table.HeaderCell>
                <Table.HeaderCell>Broj super ocena</Table.HeaderCell>
                <Table.HeaderCell>Broj favorita/omiljenih</Table.HeaderCell>
                <Table.HeaderCell>Ukloni favorita</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {favoritedActivitiesArray.map((activity: IActivity) => (
                <Table.Row key={activity.id}>
                  <Table.Cell content={ActivityTypes[activity.type]} />
                  <Table.Cell content={activity.title} />
                  <Table.Cell
                    icon="thumbs down"
                    content={activity.numberOfPoorReviews}
                  />
                  <Table.Cell
                    icon="thumbs up"
                    content={activity.numberOfNoneReviews}
                  />
                  <Table.Cell
                    icon="like"
                    content={activity.numberOfGoodReviews}
                  />
                  <Table.Cell
                    icon="exclamation"
                    content={activity.numberOfAwesomeReviews}
                  />
                  <Table.Cell
                    icon="favorite"
                    content={activity.numberOfFavorites}
                  />
                  <Table.Cell                    
                    content={<Button icon="times" loading={resolvingFavourite} onClick={() => handleClick(activity.id)} />}
                  />
                </Table.Row>
              ))}
            </Table.Body>

            <Table.Footer>
              <Table.Row textAlign="center">
                <Table.HeaderCell colSpan="8">
                  <Loader active={loadingNext} />
                  <Pagination
                    defaultActivePage={favoritedActivitiesPage + 1}
                    ellipsisItem={{
                      content: <Icon name="ellipsis horizontal" />,
                      icon: true,
                    }}
                    firstItem={{
                      content: <Icon name="angle double left" />,
                      icon: true,
                    }}
                    lastItem={{
                      content: <Icon name="angle double right" />,
                      icon: true,
                    }}
                    prevItem={{
                      content: <Icon name="angle left" />,
                      icon: true,
                    }}
                    nextItem={{
                      content: <Icon name="angle right" />,
                      icon: true,
                    }}
                    totalPages={totalFavoritedActivitiyPages}
                    onPageChange={(e, data) => handleGetNext(data)}
                  />
                </Table.HeaderCell>
              </Table.Row>
            </Table.Footer>
          </Table>
        )}
      </Fragment>
    );
}

export default observer (ProfileFavoriteActivities);