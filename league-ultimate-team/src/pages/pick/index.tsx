import { ReactElement } from "react";
import PickComponent from "../../components/pick";
import classes from "./pick.module.scss";
function Pick(): ReactElement {
  return (
    <div className={classes.container}>
      <PickComponent />
    </div>
  );
}

export default Pick;
