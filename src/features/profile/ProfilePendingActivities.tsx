import { ActivityTypes, IPendingActivity } from '../../app/models/activity';
import { Dropdown, DropdownItemProps, Icon, Input, Loader, Pagination, Table } from 'semantic-ui-react';
import { Fragment, useContext, useEffect, useState } from 'react'

import { GenerateActivityRoute } from './utils/GenerateActivityRoute';
import { Link } from 'react-router-dom';
import { RootStoreContext } from '../../app/stores/rootStore';
import { format } from 'date-fns';
import { observer } from 'mobx-react-lite';

export const ProfilePendingActivities = () => {
  const rootStore = useContext(RootStoreContext);

  const {setPredicate} = rootStore.profileStore;

  const {
    loadPendingActivitiesForUser,
    loadingInitial,
    setPendingActivitiesPage,
    pendingActivitiesPage,
    totalPendingActivityPages,
    pendingActivitiesArray
  } = rootStore.profileStore;

  const [loadingNext, setLoadingNext] = useState(false);

  useEffect(() => {
    setPendingActivitiesPage(0);
    loadPendingActivitiesForUser();
  }, [setPendingActivitiesPage, loadPendingActivitiesForUser]);

  const handleGetNext = (data : any) => {
    setLoadingNext(true);
    setPendingActivitiesPage(data.activePage - 1);
    loadPendingActivitiesForUser().then(() => setLoadingNext(false));
  }

  const options = Object.keys(ActivityTypes).map((key: any, el) => {
    if (ActivityTypes[el + 1] !== undefined)
      return {key: key, text: ActivityTypes[el + 1], value: Number(key)}
    return undefined
  }).filter(f => f !== undefined);

  return (
    <Fragment>
      <Dropdown style={{ float: "right", marginBottom:"1em" }}
       placeholder='Akivnosti' 
       multiple 
       selection 
       options={options as DropdownItemProps[]} 
       onChange={(e, {value}) => setPredicate("activityTypesArray", value?.toString() ?? "")}
      />
      <Input
        style={{ float: "right", marginBottom:"1em", marginRight:"1em" }}
        icon="spinner"
        iconPosition="left"
        placeholder="Pretraži aktivnosti..."
        onChange={(e) => setPredicate("title", e.target.value)}
      />
      {loadingInitial && !loadingNext ? (
        <Loader active inline="centered" />
      ) : (
        <Table celled textAlign="center">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Tip</Table.HeaderCell>
              <Table.HeaderCell>Naziv</Table.HeaderCell>
              <Table.HeaderCell>Datum kreiranja</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {pendingActivitiesArray.map((activity: IPendingActivity) => (
              <Table.Row key={activity.id}>
                <Table.Cell content={ActivityTypes[activity.type]} />
                <Table.Cell
                  content={
                    <Link
                      to={{
                        pathname: GenerateActivityRoute(
                          activity.type,
                          activity.id
                        ),
                      }}
                    >
                      {activity.title}
                    </Link>
                  }
                />
                {activity.dateCreated && (
                  <Table.Cell
                    content={format(
                      new Date(activity.dateCreated),
                      "d.M.yyyy H:mm "
                    )}
                  />
                )}
              </Table.Row>
            ))}
          </Table.Body>

          <Table.Footer>
            <Table.Row textAlign="center">
              <Table.HeaderCell colSpan="3">
                <Loader active={loadingNext} />
                <Pagination
                  defaultActivePage={pendingActivitiesPage + 1}
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
                  prevItem={{ content: <Icon name="angle left" />, icon: true }}
                  nextItem={{
                    content: <Icon name="angle right" />,
                    icon: true,
                  }}
                  totalPages={totalPendingActivityPages}
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

export default observer(ProfilePendingActivities);
