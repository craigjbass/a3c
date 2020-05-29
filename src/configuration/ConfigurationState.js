import { v4 as uuid } from 'uuid';

export default class ConfigurationState {
    newEvent = (track_id) => {
        const id = uuid()
        localStorage.setItem(id, JSON.stringify({ track_id: track_id }))
        return id
    }
    EventDoesNotExist = (id) => !localStorage.getItem(id)
    getEvents = () => {
        const events = []
        for(let i = 0; i<localStorage.length; i++) {
            let id = localStorage.key(i);
            events.push({
                id: id,
                track_id: JSON.parse(localStorage.getItem(id)).track_id
            })
        }
        return events
    }
    getEvent = (id) => {
        return {
            id: id,
            track_id: JSON.parse(localStorage.getItem(id)).track_id
        }
    }
}
