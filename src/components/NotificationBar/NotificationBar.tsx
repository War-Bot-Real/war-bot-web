import { playUiSound } from "../../sounds";
import { useEffect, useState } from "react";

import "./NotificationBar.css";
import type { Message } from "../../types/Messages";
import type { NotificationPopup } from "../../types/NotificationPopup";
import type { Unread } from "../../types/Read";
import { getLastRead, readCategory } from "../../api";
import type { Nation } from "../../types/Nation";

interface NotificationBarProps {
    nation: Nation | null,
    messages: Message[];
    popup: NotificationPopup;
    setPopup: (command: NotificationPopup) => void;
}

function NotificationBar({ nation, messages, popup, setPopup }: NotificationBarProps) {
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [unread, setUnread] = useState<Unread>({
        notifications: false,
        messages: false,
        news: false,
    });

    const news = messages.filter(message => message.type === "news").sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
    const playerMessages = messages.filter(message => message.type === "message").sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
    const notifications = messages.filter(message => message.type !== "news" && message.type !== "message").sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

    const filterMessages = (items: Message[]) => items.filter(message => {
        const matchesSearch = [message.message, message.sender, message.recipient, message.type].some(value => value?.toLowerCase().includes(search.toLowerCase()));
        return matchesSearch && (popup !== "notifications" || typeFilter === "all" || message.type === typeFilter);
    });
    const dateFormat: Intl.DateTimeFormatOptions = { hour: "numeric", minute: "2-digit", hour12: true, month: "short", day: "numeric"}

    useEffect(() => {
        const loadRead = async () => {
            try {
                const read = await getLastRead();
                console.log(playerMessages);

                setUnread({
                    notifications: notifications.some(
                        message => message.time > read.notifications
                    ),
                    messages: playerMessages.some(
                        message => message.time > read.messages
                    ),
                    news: news.some(
                        message => message.time > read.news
                    ),
                });
            } catch (error) {
                console.error("Failed to load read status:", error);
            }
        };

        loadRead();
    }, [messages]);

    const handleRead = async (category: keyof Unread) => {
        setUnread(current => ({
            ...current,
            [category]: false,
        }));

        try {
            await readCategory(category);
        } catch (error) {
            console.error(`Failed to mark ${category} as read:`, error);
        }
    };

    const togglePopup = (name: NotificationPopup) => {
        playUiSound("/click_default.wav");

        if (name === popup) {
            setPopup(null);
        } else {
            setPopup(name);
            if (name !== null) {
                handleRead(name);
            }
        }
    };

    return (
        <div className="notification-bar">
            <div className="notification-buttons">
                <button
                    className={`notification-button ${popup === "news" ? "active" : ""}`}
                    onClick={() => togglePopup("news")}
                >
                    <img src="/news.png" alt="World News" />
                    {unread.news && <span className="notification-dot" />}
                </button>

                <button
                    className={`notification-button ${popup === "messages" ? "active" : ""}`}
                    onClick={() => togglePopup("messages")}
                >
                    <img src="/messages.png" alt="Messages" />
                    {unread.messages && <span className="notification-dot" />}
                </button>

                <button
                    className={`notification-button ${popup === "notifications" ? "active" : ""}`}
                    onClick={() => togglePopup("notifications")}
                >
                    <img src="/notifications.png" alt="Notifications" />
                    {unread.notifications && <span className="notification-dot" />}
                </button>
            </div>

            {popup === "news" && (
                <div className="notification-popup">
                    <h3>World News</h3>
                    <div className="notification-search">
                        <input aria-label="Search notifications" placeholder="Search..." value={search} onChange={event => setSearch(event.target.value)} />
                        
                    </div>


                    {filterMessages(news).length === 0 ? (
                        <p>No world news.</p>
                    ) : (
                        filterMessages(news).map(message => (
                            <div key={message.id} className="notification-item">
                                <div className="timestamp">
                                    {new Date(message.time).toLocaleString("en-US", dateFormat)}
                                </div>
                                <p className="message-content">{message.message}</p>
                            </div>
                        ))
                    )}
                </div>
            )}

            {popup === "messages" && (
                <div className="notification-popup">
                    <h3>Messages</h3>
                    <div className="notification-search">
                        <input aria-label="Search notifications" placeholder="Search..." value={search} onChange={event => setSearch(event.target.value)} />
                        
                    </div>


                    {filterMessages(playerMessages).length === 0 ? (
                        <p>No messages.</p>
                    ) : (
                        filterMessages(playerMessages).map(message => (
                            <div key={message.id} className="notification-item">
                                <div className="timestamp">
                                    {new Date(message.time).toLocaleString("en-US", dateFormat)}
                                </div>
                                <p className="message-content">
                                    <strong>{message.sender === nation?.name ? `To ${message.recipient}` : `From ${message.sender}`}:</strong> {message.message}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            )}

            {popup === "notifications" && (
                <div className="notification-popup">
                    <h3>Notifications</h3>
                    <div className="notification-search">
                        <input aria-label="Search notifications" placeholder="Search..." value={search} onChange={event => setSearch(event.target.value)} />
                        {popup === "notifications" && <select aria-label="Filter notification type" value={typeFilter} onChange={event => setTypeFilter(event.target.value)}>
                            <option value="all">All types</option>
                            {[...new Set(notifications.map(message => message.type))].map(type => <option key={type} value={type}>{type}</option>)}
                        </select>}
                    </div>


                    {filterMessages(notifications).length === 0 ? (
                        <p>No notifications.</p>
                    ) : (
                        filterMessages(notifications).map(message => (
                            <div key={message.id} className="notification-item">
                                <div className="timestamp">
                                    {new Date(message.time).toLocaleString("en-US", dateFormat)}
                                </div>
                                <p className="message-content">{message.message}</p>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default NotificationBar;