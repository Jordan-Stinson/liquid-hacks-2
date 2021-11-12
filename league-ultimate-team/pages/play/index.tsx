import { NextPage } from "next";
import { ReactElement } from "react";
import PlayComponent from "../../components/play";
import classes from "./play.module.scss";
const Play: NextPage = () => {
  console.log("here");
  return (
    <div className={classes.container}>
      <PlayComponent />
    </div>
  );
};

export default Play;
