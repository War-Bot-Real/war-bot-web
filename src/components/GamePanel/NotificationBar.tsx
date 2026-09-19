import { useState } from "react";
import "./NotificationBar.css";
import type { Message } from "../../types/Messages";

type Popup = "news" | "messages" | "notifications" | null;

interface NotificationBarProps {
    messages: Message[];
}

function NotificationBar({ messages }: NotificationBarProps) {
    const [popup, setPopup] = useState<Popup>(null);

    const togglePopup = (name: Exclude<Popup, null>) => {
        setPopup(current => current === name ? null : name);
    };

    const news = messages.filter(message => message.type === "news");
    const playerMessages = messages.filter(message => message.type === "message");
    const notifications = messages.filter(message => message.type !== "news" && message.type !== "message");

    return (
        <div className="notification-bar">
            <div className="notification-buttons">
                <button
                    className={`notification-button ${popup === "news" ? "active" : ""}`}
                    onClick={() => togglePopup("news")}
                >
                    <img src="/news.png" alt="World News" />
                </button>

                <button
                    className={`notification-button ${popup === "messages" ? "active" : ""}`}
                    onClick={() => togglePopup("messages")}
                >
                    <img src="/messages.png" alt="Messages" />
                </button>

                <button
                    className={`notification-button ${popup === "notifications" ? "active" : ""}`}
                    onClick={() => togglePopup("notifications")}
                >
                    <img src="/notifications.png" alt="Notifications" />
                </button>
            </div>

            {popup === "news" && (
                <div className="notification-popup">
                    <h3>World News</h3>

                    {news.length === 0 ? (
                        <p>No world news.</p>
                    ) : (
                        news.map(message => (
                            <p key={message.id}>
                                {message.message}
                            </p>
                        ))
                    )}
                </div>
            )}

            {popup === "messages" && (
                <div className="notification-popup">
                    <h3>Messages</h3>

                    {playerMessages.length === 0 ? (
                        <p>No messages.</p>
                    ) : (
                        playerMessages.map(message => (
                            <p key={message.id}>
                                <strong>{message.sender}:</strong> {message.message}
                            </p>
                        ))
                    )}
                </div>
            )}

            {popup === "notifications" && (
                <div className="notification-popup">
                    <h3>Notifications</h3>

                    {notifications.length === 0 ? (
                        <p>No notifications.</p>
                    ) : (
                        notifications.map(message => (
                            <p key={message.id}>
                                {message.message}
                            </p>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default NotificationBar;