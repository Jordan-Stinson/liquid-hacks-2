import { FC, ReactElement } from "react";
import classes from "./pick.module.scss";
import Image from "next/image";
import LoLIcon from "../../public/images/lol-icon.png";

export interface HowToPlayProps {}

const PickComponent: FC<HowToPlayProps> = ({}): ReactElement => {
  return (
    <div className={classes.wrapper}>
      <div className={classes.title}>
        <span>How To Play</span>
      </div>

      <div className={classes.paragraph}>
        To start playing League of Legends: Ultimate Team, go to
        <a href={"http://localhost:3000"}>localhost:3000</a>
        and click the button labeled Play now, or go to
        <a href={"http://localhost:3000/play"}>localhost:3000/play</a>.
      </div>

      <div className={classes.paragraph}>
        You will then need to make your team. For each role, you will be
        presented with
      </div>
    </div>
  );
};

export default PickComponent;
