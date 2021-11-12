import { ReactElement } from "react";
import HowToPlayComponent from "../../components/how-to-play";
import classes from "./how-to-play.module.scss";
function HowToPlay(): ReactElement {
  return (
    <div className={classes.container}>
      <HowToPlayComponent />
    </div>
  );
}

export default HowToPlay;
