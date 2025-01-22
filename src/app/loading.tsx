import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex-center size-full">
      <Image
        src="/tube-spinner.svg"
        alt="loader"
        width={40}
        height={40}
        className="animate-spin w-10 h-auto"
      />
      <div className="flex-center size-full h-screen gap-3 text-black">
        <h1>Loading...</h1>
      </div>
    </div>
      
  );
}