import type { Nation } from "../../../types/Nation";
import Flag from "../../Flag";

interface NationFlowProps {
    nation: Nation;
}

function NationFlow({
    nation,
}: NationFlowProps) {
    return (
        <>
            <h2>
              <Flag code={nation.flag}></Flag> 
              {nation.name}
            </h2>

            <p>
                <strong>Ideology:</strong>{" "}
                {nation.ideology}
            </p>

            <p>
                <strong>Capital:</strong>{" "}
                {nation.capital}
            </p>
        </>
    );
}

export default NationFlow;