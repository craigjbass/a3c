import React, {useEffect, useState} from 'react'
import {HTMLTable, Spinner} from "@blueprintjs/core";

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

    return <Layout>
      <HTMLTable interactive={true} striped={true}>
        <thead>
        <tr>
          <th>id</th>
        </tr>
        </thead>
        <tbody>
        {events.map((event) => <tr key={event.id} onClick={() => navigate(`/events/${event.id}`)}>
          <td>{event.id}</td>
        </tr>)}
        </tbody>
      </HTMLTable>
    </Layout>
  }