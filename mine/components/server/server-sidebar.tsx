import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ChannelType, MemberRole } from "@prisma/client";
import { channel } from "diagnostics_channel";
import { redirect } from "next/navigation";
import { ServerHeader } from "./server-header";
import { ScrollArea } from "../ui/scroll-area";
import ServerSearch from "./server-search";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";
import { Separator } from "../ui/separator";
import { ServerSection } from "./server-section";
import { ServerChannel } from "./server-channel";
import { ServerMember } from "./server-member";

interface ServerSiderbarProps {
    serverId: string;
}

const iconMap = {
    [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
    [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
    [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />,
}
const roleIconMap = {
    [MemberRole.GUEST]: null,
    [MemberRole.MODERATOR]: <ShieldCheck className="h-4 w-4 mr-2 text-indigo-500" />,
    [MemberRole.ADMIN]: <ShieldAlert className="text-rose-500 h-4 w-4 mr-2" />
}

const ServerSidebar = async ({
    serverId
}: ServerSiderbarProps) => {

    const profile = await currentProfile();
    if (!profile)
        return redirect("/");

    const server = await db.server.findUnique({
        where: {
            id: serverId,
        },
        include: {
            channel: {
                orderBy: {
                    createdAt: "asc"
                }
            },
            member: {
                include: {
                    profile: true,
                },
                orderBy: {
                    role: "asc"
                }
            }
        }
    });

    const textChannels = server?.channel.filter((channel) => channel.type === ChannelType.TEXT);
    const audioChannels = server?.channel.filter((channel) => channel.type === ChannelType.AUDIO);
    const vidoeChannels = server?.channel.filter((channel) => channel.type === ChannelType.VIDEO);

    const member = server?.member.filter((member) => member.profileId !== profile.id);

    if (!server)
        return redirect("/");

    const role = server.member.find((member) => member.profileId === profile.id)?.role;

    return (
        <div className="flex flex-col h-full text-primary w-full px-2 dark:bg-[#2B2D31] bg-[#F2F3F5]">
            <ServerHeader
                server={server}
                role={role}
            />
            <ScrollArea
                className="flex px-3"
            >
                <div className="mt-2 px-1">
                    <ServerSearch
                        data={[
                            {
                                label: "Text Channels",
                                type: "channel",
                                data: textChannels?.map((channel) => ({
                                    id: channel.id,
                                    name: channel.name,
                                    icon: iconMap[channel.type]
                                }))
                            },
                            {
                                label: "Voice Channels",
                                type: "channel",
                                data: audioChannels?.map((channel) => ({
                                    id: channel.id,
                                    name: channel.name,
                                    icon: iconMap[channel.type],
                                }))
                            },
                            {
                                label: "Video Channels",
                                type: "channel",
                                data: vidoeChannels?.map((channel) => ({
                                    id: channel.id,
                                    name: channel.name,
                                    icon: iconMap[channel.type],
                                }))
                            },
                            {
                                label: "Members",
                                type: "member",
                                data: member?.map((member) => ({
                                    id: member.id,
                                    name: member.profile.name,
                                    icon: roleIconMap[member.role],
                                }))
                            },
                        ]}
                    />
                </div>
            </ScrollArea>
            <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
            {!!textChannels?.length && (
                <div className="mb-2">
                    <ServerSection
                        sectionType="channel"
                        channelType={ChannelType.TEXT}
                        role={role}
                        label="Text Channels"
                    />
                    <div className="space-y-[2px]">
                        {textChannels.map((channel) => (
                            <ServerChannel
                                key={channel.id}
                                channel={channel}
                                server={server}
                                role={role}
                            />
                        ))}
                    </div>
                </div>
            )}

            {!!audioChannels?.length && (
                <div className="mb-2">
                    <ServerSection
                        sectionType="channel"
                        channelType={ChannelType.AUDIO}
                        role={role}
                        label="Voice Channels"
                    />
                    <div className="space-y-[2px]">

                        {audioChannels.map((channel) => (
                            <ServerChannel
                                key={channel.id}
                                channel={channel}
                                server={server}
                                role={role}
                            />
                        ))}
                    </div>
                </div>
            )}
            {!!vidoeChannels?.length && (
                <div className="mb-2">
                    <ServerSection
                        sectionType="channel"
                        channelType={ChannelType.VIDEO}
                        role={role}
                        label="Video Channels"
                    />
                    <div className="space-y-[2px]">

                        {vidoeChannels.map((channel) => (
                            <ServerChannel
                                key={channel.id}
                                channel={channel}
                                server={server}
                                role={role}
                            />
                        ))}
                    </div>
                </div>
            )}
            {!!member?.length && (

                <div className="mb-2">
                    <ServerSection
                        sectionType="member"
                        role={role}
                        label="Members"
                        server={server}
                    />
                    <div className="space-y-[2px]">

                        {member.map((member) => (
                            <ServerMember
                                key={member.id}
                                member={member}
                                server={server}
                             />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default ServerSidebar;