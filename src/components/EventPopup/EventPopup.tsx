import type { Message } from "../../types/Messages";
import "./EventPopup.css";

interface EventPopupProps {
    events: Message[];
    setEvents: (events: Message[]) => void;
}

function EventPopup({ events, setEvents }: EventPopupProps) {
    if (events.length === 0) return null;

    const closeTopEvent = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (event.ctrlKey || event.shiftKey) {
            setEvents([]);
            return;
        }

        setEvents(events.slice(1));
    };

    return (
        <div className="event-popup-container">
            {events.map((event, index) => (
                <div key={event.id}>
                  <div className="header"> Dispatch {events.length > 1 ? `(${index})` : ""} </div>
                  <div className={`event-popup ${index === 0 ? "active" : ""}`}>
                      {index === 0 && (
                          <button className="event-popup-close" onClick={closeTopEvent}>
                              ×
                          </button>
                      )}

                      <p>{event.message}</p>
                  </div>
                </div>
            ))}
        </div>
    );
}

export default EventPopup;