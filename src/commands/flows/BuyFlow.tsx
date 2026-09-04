import { useState } from "react";
import { buy } from "../../api";

function BuyFlow() {
    const [quan, setQuan] = useState(0);
    const [item, setItem] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleBuy = async () => {
      if(quan < 1) {
        setError("Cannot have a quantity of less than one!")
      }
      
      setLoading(true)
      buy(item, quan)
    };

    return (
        <div>
            <h2>Buy</h2>

            <div>
                <input
                    type="text"
                    onChange={(event) =>
                        setItem(event.target.value)
                    }
                    disabled={loading}
                    placeholder="Item"
                />
                <br/>
                <input
                    type="number"
                    min="1"
                    onChange={(event) =>
                        {
                          setQuan(parseInt(event.target.value))
                          setError("")
                        }
                    }
                    disabled={loading}
                    placeholder="Quantity"
                />
                <br/>
                <button onClick={handleBuy} disabled={loading}>Buy!</button>
            </div>
            <p>{error}</p>
        </div>
    );
}

export default BuyFlow;