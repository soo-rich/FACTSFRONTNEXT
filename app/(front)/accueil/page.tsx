"use client";
import { Button } from "@heroui/button";

import Notif from "@/utils/notif";

const Page = () => {
  return (
    <div>
      <Button onPress={() => Notif.success({ message: "fait" })}>Taosr</Button>
    </div>
  );
};

export default Page;
