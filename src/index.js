import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App-v1";

import StartRating from "./StartRating";

function Test(){
  const [movieRating,setMovieRating] = useState(0);

  return(
    <div>
      <StartRating color="pink" 
        maxRating={5} 
        onSetRating={setMovieRating}>
      </StartRating>
      <p>this movie was rating {movieRating} starss</p>
    </div>
  )
}



const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />

    {/* <StartRating 
      maxRating={5}
      messages={['Terrible','Bad','Okay','Good','Amazing']}
    /> */}


    {/* <StarRating
      maxRating={5}
      messages={["Terrible", "Bad", "Okay", "Good", "Amazing"]}
    />
    <StarRating size={24} color="red" className="test" defaultRating={2} />
*/}
    {/* <Test />  */}
  </React.StrictMode>
);
