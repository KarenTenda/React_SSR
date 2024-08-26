import Urls from "@/constants/Urls";
import Image from "next/image";

const HomePage = () => {
  return (
    <>
      <img
        src={`${Urls.fetchMainWindowCamera}`}
        alt="Main Window Camera"
        width={800}  
        height={450}  
        loading="lazy"
      />
    </>
  );
};

export default HomePage;
