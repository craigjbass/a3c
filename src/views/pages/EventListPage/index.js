import React, {useEffect, useState} from 'react'
import {AnchorButton, Button, HTMLTable, Intent, NonIdealState, Spinner} from "@blueprintjs/core";

export default ({Layout, navigate, listEvents}) =>
  () => {
    const [events, setEvents] = useState(undefined)

    useEffect(() => {
      if (events !== undefined) return

      setEvents([])
      listEvents({}, {
        event: (event) => setEvents((events) => [event].concat(events)),
        done: () => {
        }
      })

    }, [events])

    if (events === undefined) return <Layout>
      <Spinner/>
    </Layout>

    if (events.length === 0) return <Layout>
      <NonIdealState title="You haven't created any events."
                     icon="heart-broken"
                     action={
                       <AnchorButton intent={Intent.PRIMARY}
                                     onClick={() => navigate("/events/new")}>
                         Create one
                       </AnchorButton>
                     }/>
    </Layout>

    return <Layout contextual={<Button intent={Intent.PRIMARY}
                                       text="Create"
                                       onClick={() => navigate("/events/new")}/>}>
      <HTMLTable interactive={true} striped={true}>
        <thead>
        <tr>
          <th>event name</th>
          <th>track name</th>
        </tr>
        </thead>
        <tbody>
        {events.map((event) => <tr key={event.id} onClick={() => navigate(`/events/${event.id}`)}>
          <td>{event.name}</td>
          <td>{event.track_name}</td>
        </tr>)}
        </tbody>
      </HTMLTable>
    </Layout>
  }