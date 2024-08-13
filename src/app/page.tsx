import Urls from "@/constants/Urls";
import Image from "next/image";

const HomePage = () => {
  return (
    <iframe
      src={`${Urls.fetchMainWindowCamera}`}
      width="100%"
      height="100%"
    />
  )
};

export default HomePage;
