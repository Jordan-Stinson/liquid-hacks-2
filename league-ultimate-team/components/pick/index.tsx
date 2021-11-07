import { FC, ReactElement } from "react";
import classes from "./pick.module.scss";
import Image from "next/image";
import LoLIcon from "../../public/images/lol-icon.png";

export interface PickProps {}

const PickComponent: FC<PickProps> = ({}): ReactElement => {
  return (
    <div className={classes.wrapper}>
      <Image
        src={LoLIcon}
        alt="LoLIcon"
        width={200}
        height={200}
        placeholder={"blur"}
      />
    </div>
  );
};

export default PickComponent;
