// import { ModeToggle } from "@/components/mode-toggle";
// import { Button } from "@/components/ui/button";
// import { UserButton } from "@clerk/nextjs/app-beta";
// export default function Home() {
//   return (
//     <div>
//       <UserButton
//         afterSignOutUrl="/"
//       />
//       <ModeToggle/>
//     </div>
//   );
// }

import { InitialModal } from "@/components/modals/inital-modal";
import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";
import { redirect } from "next/navigation";

const SetupPage = async() => {

  const profile = await initialProfile();

  const server = await db.server.findFirst({
    where:{
      member:{
        some:{
          profileId:profile.id
        }
      }
    }
  });

  if(server){
    return redirect(`/servers/${server.id}`);
  }
  return <InitialModal/>;
}
 
export default SetupPage;