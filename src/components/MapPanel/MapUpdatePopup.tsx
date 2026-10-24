import "./MapUpdatePopup.css"

interface MapUpdatePopupProps {
    onUpdate: () => void;
}

function MapUpdatePopup({onUpdate}: MapUpdatePopupProps) {
    return (
        <div className="map-update-popup">
            <span>The map has changed. <a onClick={onUpdate}> Update </a> </span>
        </div>
    );
}

export default MapUpdatePopup;