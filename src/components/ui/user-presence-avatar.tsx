'use client';

import * as React from 'react';
import { motion, LayoutGroup } from 'framer-motion';

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@/components/ui/avatar';
import {
    TooltipProvider,
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const USERS = [
    {
        id: 1,
        src: '/images/team/p1.png',
        fallback: 'AL',
        tooltip: 'Aldy',
        online: true,
    },
    {
        id: 2,
        src: '/images/team/p2.png',
        fallback: 'KE',
        tooltip: 'Kevin',
        online: true,
    },
    {
        id: 3,
        src: '/images/team/p5.png',
        fallback: 'OW',
        tooltip: 'Owen',
        online: true,
    },
    {
        id: 4,
        src: '/images/team/p4.png',
        fallback: 'FR',
        tooltip: 'Friesta',
        online: true,
    },
    {
        id: 5,
        src: '/images/team/p10.png',
        fallback: 'NA',
        tooltip: 'Natasya',
        online: false,
    },
    {
        id: 6,
        src: '/images/team/p7.png',
        fallback: 'RI',
        tooltip: 'Rizky',
        online: false,
    },
    {
        id: 7,
        src: '/images/team/p3.png',
        fallback: 'JA',
        tooltip: 'Jazel',
        online: false,
    },
    {
        id: 8,
        src: '/images/team/p8.png',
        fallback: 'GI',
        tooltip: 'Giordyano',
        online: false,
    },
    {
        id: 9,
        src: '/images/team/p9.jpeg',
        fallback: 'GI',
        tooltip: 'Given',
        online: false,
    },
];

const AVATAR_SPRING = {
    type: 'spring',
    stiffness: 300,
    damping: 17,
} as const;

const AVATAR_VARIANTS = {
    initial: { y: 0 },
    hover: { y: '-30%' },
};

const GROUP_CONTAINER_TRANSITION = {
    type: 'spring',
    stiffness: 150,
    damping: 20,
} as const;

export function UserPresenceAvatar() {
    const [users, setUsers] = React.useState(USERS);
    const [togglingGroup, setTogglingGroup] = React.useState<
        'online' | 'offline' | null
    >(null);

    const online = users.filter((u) => u.online);
    const offline = users.filter((u) => !u.online);

    const toggleStatus = (id: number) => {
        const user = users.find((u) => u.id === id);
        if (!user) return;

        setTogglingGroup(user.online ? 'online' : 'offline');
        setUsers((prev) => {
            const idx = prev.findIndex((u) => u.id === id);
            if (idx === -1) return prev;
            const updated = [...prev];
            const target = updated[idx];
            if (!target) return prev;
            updated.splice(idx, 1);
            updated.push({ ...target, online: !target.online });
            return updated;
        });
        setTimeout(() => setTogglingGroup(null), 500);
    };

    return (
        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6">
            <LayoutGroup>
                <TooltipProvider delayDuration={0}>
                    {online.length > 0 && (
                        <motion.div
                            layout
                            className={cn(
                                'bg-slate-100 dark:bg-slate-800 p-1 rounded-full',
                                togglingGroup === 'online' ? 'z-[5]' : 'z-[10]',
                            )}
                            transition={GROUP_CONTAINER_TRANSITION}
                        >
                            <div
                                key={online.map((u) => u.id).join('_') + '-online'}
                                className="flex items-center h-12 sm:h-14 -space-x-3 sm:-space-x-4"
                            >
                                {online.map((user, index) => (
                                    <Tooltip key={user.id}>
                                        <TooltipTrigger asChild>
                                            <motion.div
                                                layoutId={`avatar-${user.id}`}
                                                className="relative cursor-pointer"
                                                onClick={() => toggleStatus(user.id)}
                                                initial="initial"
                                                whileHover="hover"
                                                whileTap="hover"
                                                style={{ zIndex: online.length - index }}
                                            >
                                                <motion.div
                                                    variants={AVATAR_VARIANTS}
                                                    transition={AVATAR_SPRING}
                                                    animate={{
                                                        filter: 'grayscale(0)',
                                                        scale: 1,
                                                    }}
                                                >
                                                    <Avatar className="size-12 sm:size-14 border-2 border-white dark:border-slate-800 shadow-md transition-shadow hover:shadow-lg">
                                                        <AvatarImage src={user.src} className="object-cover" />
                                                        <AvatarFallback className="bg-primary text-white font-medium text-[10px] sm:text-xs">{user.fallback}</AvatarFallback>
                                                    </Avatar>
                                                </motion.div>
                                                <TooltipContent
                                                    side="top"
                                                    sideOffset={15}
                                                    className="bg-white text-slate-900 border-none shadow-xl px-4 py-2 rounded-xl font-bold text-xs sm:text-sm animate-in fade-in-0 zoom-in-95 data-[side=top]:slide-in-from-bottom-2 duration-200 z-[100]"
                                                >
                                                    <p>{user.tooltip}</p>
                                                </TooltipContent>
                                            </motion.div>
                                        </TooltipTrigger>
                                    </Tooltip>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {offline.length > 0 && (
                        <motion.div
                            layout
                            className={cn(
                                'bg-slate-100 dark:bg-slate-800 p-1 rounded-full',
                                togglingGroup === 'offline' ? 'z-[5]' : 'z-[10]',
                            )}
                            transition={GROUP_CONTAINER_TRANSITION}
                        >
                            <div
                                key={offline.map((u) => u.id).join('_') + '-offline'}
                                className="flex items-center h-12 sm:h-14 -space-x-3 sm:-space-x-4"
                            >
                                {offline.map((user, index) => (
                                    <Tooltip key={user.id}>
                                        <TooltipTrigger asChild>
                                            <motion.div
                                                layoutId={`avatar-${user.id}`}
                                                className="relative cursor-pointer"
                                                onClick={() => toggleStatus(user.id)}
                                                initial="initial"
                                                whileHover="hover"
                                                whileTap="hover"
                                                style={{ zIndex: offline.length - index }}
                                            >
                                                <motion.div
                                                    variants={AVATAR_VARIANTS}
                                                    transition={AVATAR_SPRING}
                                                    animate={{
                                                        filter: 'grayscale(1)',
                                                        scale: 1,
                                                    }}
                                                >
                                                    <Avatar className="size-12 sm:size-14 border-2 border-white dark:border-slate-800 shadow-md brightness-90 transition-shadow hover:shadow-lg">
                                                        <AvatarImage src={user.src} className="object-cover" />
                                                        <AvatarFallback className="bg-slate-200 text-slate-500 font-medium text-[10px] sm:text-xs">{user.fallback}</AvatarFallback>
                                                    </Avatar>
                                                </motion.div>
                                                <TooltipContent
                                                    side="top"
                                                    sideOffset={15}
                                                    className="bg-white text-slate-900 border-none shadow-xl px-4 py-2 rounded-xl font-bold text-xs sm:text-sm animate-in fade-in-0 zoom-in-95 data-[side=top]:slide-in-from-bottom-2 duration-200 z-[100]"
                                                >
                                                    <p>{user.tooltip}</p>
                                                </TooltipContent>
                                            </motion.div>
                                        </TooltipTrigger>
                                    </Tooltip>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </TooltipProvider>
            </LayoutGroup>
        </div>
    );
}
