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
              <Flag code={nation.Flag}></Flag> 
              {nation.Name}
            </h2>

            <p>
                <strong>Ideology:</strong>{" "}
                {nation.Ideology}
            </p>

            <p>
                <strong>Capital:</strong>{" "}
                {nation.Capital}
            </p>
        </>
    );
}

export default NationFlow;