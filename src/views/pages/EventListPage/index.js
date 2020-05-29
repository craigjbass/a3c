import React, {useEffect, useState} from 'react'
import {AnchorButton, HTMLTable, Intent, NonIdealState, Spinner} from "@blueprintjs/core";

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

    if(events === undefined) return <Layout>
      <Spinner />
    </Layout>

    if(events.length === 0) return <Layout>
      <NonIdealState title="You haven't created any events."
                     icon="heart-broken"
                     action={
                       <AnchorButton intent={Intent.PRIMARY}
                                     onClick={() => navigate("/")}>
                         Create one
                       </AnchorButton>
                     }/>
    </Layout>

    return <Layout>
      <HTMLTable interactive={true} striped={true}>
        <thead>
        <tr>
          <th>id</th>
          <th>event name</th>
          <th>track name</th>
        </tr>
        </thead>
        <tbody>
        {events.map((event) => <tr key={event.id} onClick={() => navigate(`/events/${event.id}`)}>
          <td>{event.id}</td>
          <td>{event.name}</td>
          <td>{event.track_name}</td>
        </tr>)}
        </tbody>
      </HTMLTable>
    </Layout>
  }