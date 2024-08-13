import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex-center size-full">
      <Image
        src="/tube-spinner.svg"
        alt="loader"
        width={40}
        height={3240}
        className="animate-spin"
      />
      <div className="flex-center size-full h-screen gap-3 text-black">
        <h1>Loading...</h1>
      </div>
    </div>
      
  );
}