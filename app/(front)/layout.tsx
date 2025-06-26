import { ChildrenType } from "@/types/types";
import { Navbar } from "@/components/shared/front/navbar";

const FrontLayout = ({ children }: ChildrenType) => {
  return (
    <div className="relative flex flex-col h-screen">
      <Navbar />
      <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
        {children}
      </main>
    </div>
  );
};

export default FrontLayout;
