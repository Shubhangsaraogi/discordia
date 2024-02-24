import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface InviteCodeProps {
    params: {
        inviteCode: string;
    };
};

const InviteCodePage = async ({
    params
}: InviteCodeProps) => {
    const profile = await currentProfile();
    if (!profile)
        return redirectToSignIn();

    if (!params.inviteCode)
        return redirect("/");

    const existingServer = await db.server.findFirst({
        where: {
            inviteCode: params.inviteCode,
            member: {
                some: {
                    profileId: profile.id,
                }
            }
        }
    })
    if (existingServer)
        return redirect(`/servers/${existingServer.id}`);

    const adminProfile = await db.server.findFirst({
        where: {
            profileId: profile.id
        }
    })
    if (adminProfile) {
        const server = await db.server.update({
            where: {
                inviteCode: params.inviteCode
            },
            data: {
                member: {
                    create: {
                        profileId: profile.id
                    }
                }
            }
        })
        if(server)
            return redirect(`/servers/${server.id}`);
    }
    else{
        const validInviteCode=await db.server.findFirst({
            where:{
                inviteCode:params.inviteCode
            }
        })
        if(validInviteCode)
            return redirect(`/servers/${validInviteCode.id}`);
        else
            return redirect("/");
    }
}

export default InviteCodePage;