import * as Flags from "country-flag-icons/react/3x2";

import YU from "../assets/flags/YU.png";
import KAL from "../assets/flags/KAL.png";
import "./Flag.css"

interface FlagProps {
    code: string;
    className?: string;
}

const customFlags: Record<string, string> = {
    YU,
    KAL,
};

function Flag({ code, className = "" }: FlagProps) {
    const customFlag = customFlags[code];

    if (customFlag) {
        return (
            <img
                src={customFlag}
                className={`flag ${className}`}
            />
        );
    }

    const FlagComponent =
        Flags[code as keyof typeof Flags];

    if (!FlagComponent) {
        return null;
    }

    return (
        <FlagComponent
            className={`flag ${className}`}
            title={code}
        />
    );
}

export default Flag;