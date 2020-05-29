import { v4 as uuid } from 'uuid';

export default class ConfigurationState {
    newEvent = (track_id) => {
        const id = uuid()
        localStorage.setItem(id, JSON.stringify({ id, track_id: track_id }))
        return id
    }
    EventDoesNotExist = (id) => !localStorage.getItem(id)
    getEvents = () => {
        const events = []
        for(let i = 0; i<localStorage.length; i++) {
            let id = localStorage.key(i);
            events.push(this.getEvent(id))
        }
        return events
    }
    getEvent = (id) => {
        return {
            ...JSON.parse(localStorage.getItem(id)),
            id
        }
    }
    update = (id, fn) => {
        const event = this.getEvent(id)
        const newEvent = fn(event)
        localStorage.setItem(id, JSON.stringify(newEvent))
    }
}
