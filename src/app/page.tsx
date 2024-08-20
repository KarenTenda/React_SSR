import Urls from "@/constants/Urls";
import Image from "next/image";

const HomePage = () => {
  return (
    <>
      
      <img
        src={`${Urls.fetchMainWindowCamera}`}
        width="100%"
        height="100%"
        loading="lazy"
      />
    </>

  )
};

export default HomePage;
