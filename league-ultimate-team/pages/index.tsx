import type { GetServerSideProps, NextPage } from "next";

import LandingPage from "../components/landing-page";
import path from "path";
import useSWR from "swr";

const Home: NextPage = () => {
  const fetcher = (url: string) =>
    fetch(url).then((res) => {
      console.log(res, "the res");
      return res.json();
    });
  const { data } = useSWR("/api/readfiles", fetcher);
  console.log(data, "the data");
  return (
    <div>
      <LandingPage playerImages={data ?? []} />
    </div>
  );
};

export default Home;
