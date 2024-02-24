import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(
    req: Request,
    { params }: { params: { serverId: string } }
) {
    try {
        const profile = await currentProfile();
        if (!profile)
            return new NextResponse("Unauthorized", { status: 401 });
        if (!params.serverId)
            return new NextResponse("Missing serverid", { status: 400 });
        const server = await db.server.delete({
            where: {
                id: params.serverId,
                profileId: profile.id
            }
        })
        return NextResponse.json(server);
    } catch (error) {
        console.log("[SERVER_Id_DELETE]", error)
        return new NextResponse("Internal Error", { status: 500 });
    }
}
export async function PATCH(
    req: Request,
    { params }: { params: { serverId: string } }
) {
    try {
        const profile = await currentProfile();
        const { name, imaageUrl } = await req.json();
        if (!profile)
            return new NextResponse("Unauthorized", { status: 401 });
        const server = await db.server.update({
            where: {
                id: params.serverId,
                profileId: profile.id
            },
            data: {
                name: name,
                imageUrl: imaageUrl
            }
        })
        return NextResponse.json(server);
    } catch (error) {
        console.log("[SERVER_ID]", error);
    }
}