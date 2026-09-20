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
                <>
                  <div className="header"> Dispatch {events.length > 0 ? `(${index})` : ""} </div>
                  <div className={`event-popup ${index === 0 ? "active" : ""}`} key={event.id}>
                      {index === 0 && (
                          <button className="event-popup-close" onClick={closeTopEvent}>
                              ×
                          </button>
                      )}

                      <p>{event.message}</p>
                  </div>
                </>
            ))}
        </div>
    );
}

export default EventPopup;