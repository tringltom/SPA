import { ActivityTypes, IPendingActivity } from '../../app/models/activity';
import { Dropdown, DropdownItemProps, Grid, Icon, Input, Loader, Pagination, Table } from 'semantic-ui-react';
import React, { Fragment, useContext, useEffect, useState } from 'react'

import { GenerateActivityRoute } from './utils/GenerateActivityRoute';
import { Link } from 'react-router-dom';
import { RootStoreContext } from '../../app/stores/rootStore';
import { format } from 'date-fns';
import { observer } from 'mobx-react-lite';
import { JsxFragment } from 'typescript';

interface IProps {
    userId: string;
  }

const ProfileApprovedActivities: React.FC<IProps> = ({ userId }) => {
    const rootStore = useContext(RootStoreContext);
    const {setPredicate} = rootStore.activityStore;
    
  
    const {
        loadingInitial,
        setApprovedActivitiesPage,
        approvedActivitiesPage,
        totalApprovedActivityPages,
        approvedActivitiesArray,
        loadApprovedActivitiesForUser
    } = rootStore.activityStore;

    const [loadingNext, setLoadingNext] = useState(false);
    
    
    useEffect(() => {
        setApprovedActivitiesPage(0);
        loadApprovedActivitiesForUser(Number(userId));
    }, [setApprovedActivitiesPage, loadApprovedActivitiesForUser, userId]);

    const handleGetNext = (data: any) => {
        setLoadingNext(true);
        setApprovedActivitiesPage(data.activePage - 1);
        loadApprovedActivitiesForUser(Number(userId)).then(() => setLoadingNext(false));
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
                <Table.HeaderCell>Datum odobravanja</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {approvedActivitiesArray.map((activity: IPendingActivity) => (
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
                  {activity.dateApproved && (
                    <Table.Cell
                      content={format(
                        new Date(activity.dateApproved),
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
                    defaultActivePage={approvedActivitiesPage + 1}
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
                    totalPages={totalApprovedActivityPages}
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

export default observer (ProfileApprovedActivities);