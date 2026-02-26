export default function TeamSection() {
    const leadership = [
        {
            name: 'Aldy Loing',
            role: 'Team Leader',
            avatar: '/images/team/p1.png',
        },
        {
            name: 'Owen Kalumata',
            role: 'Project Manager',
            avatar: '/images/team/p5.png',
        },
        {
            name: 'Natasya Lumingkewas',
            role: 'Finance Officer',
            avatar: '/images/team/p10.png',
        }
    ];

    const engineering = [
        {
            name: 'Kevin Pesik',
            role: 'Developer',
            avatar: '/images/team/p2.png',
        },
        {
            name: 'Rizky Mema',
            role: 'UI/UX Designer',
            avatar: '/images/team/p7.png',
        },
        {
            name: 'Jazel Kandou',
            role: 'Quality Control',
            avatar: '/images/team/p3.png',
        }
    ];

    const creativeMarketing = [
        {
            name: 'Giordyano Anhar',
            role: 'Creative Director',
            avatar: '/images/team/p8.png',
        },
        {
            name: 'Friestha Arikalang',
            role: 'Team Creative',
            avatar: '/images/team/p4.png',
        }
    ];

    const humanRelations = [
        {
            name: 'Given Tambalean',
            role: 'Human Relations',
            avatar: '/images/team/p9.jpeg',
        }
    ];

    return (
        <section id="team" className="py-12 md:py-32">
            <div className="mx-auto max-w-3xl px-8 lg:px-0">
                <h2 className="mb-8 text-4xl font-bold md:mb-16 lg:text-5xl">Our team</h2>

                <div>
                    <h3 className="mb-6 text-lg font-medium">Leadership</h3>
                    <div className="grid grid-cols-2 gap-4 border-t py-6 md:grid-cols-4">
                        {leadership.map((member, index) => (
                            <div key={index}>
                                <div className="bg-background size-20 rounded-full border p-0.5 shadow shadow-zinc-950/5">
                                    <img 
                                        className="aspect-square rounded-full object-cover" 
                                        src={member.avatar} 
                                        alt={member.name} 
                                        height="460" 
                                        width="460" 
                                        loading="lazy" 
                                    />
                                </div>
                                <span className="mt-2 block text-sm font-medium">{member.name}</span>
                                <span className="text-muted-foreground block text-xs text-gray-500">{member.role}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-6">
                    <h3 className="mb-6 text-lg font-medium">Engineering</h3>
                    <div data-rounded="full" className="grid grid-cols-2 gap-4 border-t py-6 md:grid-cols-4">
                        {engineering.map((member, index) => (
                            <div key={index}>
                                <div className="bg-background size-20 rounded-full border p-0.5 shadow shadow-zinc-950/5">
                                    <img 
                                        className="aspect-square rounded-full object-cover" 
                                        src={member.avatar} 
                                        alt={member.name} 
                                        height="460" 
                                        width="460" 
                                        loading="lazy" 
                                    />
                                </div>
                                <span className="mt-2 block text-sm font-medium">{member.name}</span>
                                <span className="text-muted-foreground block text-xs text-gray-500">{member.role}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-6">
                    <h3 className="mb-6 text-lg font-medium">Creative & Marketing</h3>
                    <div data-rounded="full" className="grid grid-cols-2 gap-4 border-t py-6 md:grid-cols-4">
                        {creativeMarketing.map((member, index) => (
                            <div key={index}>
                                <div className="bg-background size-20 rounded-full border p-0.5 shadow shadow-zinc-950/5">
                                    <img 
                                        className="aspect-square rounded-full object-cover" 
                                        src={member.avatar} 
                                        alt={member.name} 
                                        height="460" 
                                        width="460" 
                                        loading="lazy" 
                                    />
                                </div>
                                <span className="mt-2 block text-sm font-medium">{member.name}</span>
                                <span className="text-muted-foreground block text-xs text-gray-500">{member.role}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-6">
                    <h3 className="mb-6 text-lg font-medium">Human Relations</h3>
                    <div data-rounded="full" className="grid grid-cols-2 gap-4 border-t py-6 md:grid-cols-4">
                        {humanRelations.map((member, index) => (
                            <div key={index}>
                                <div className="bg-background size-20 rounded-full border p-0.5 shadow shadow-zinc-950/5">
                                    <img 
                                        className="aspect-square rounded-full object-cover" 
                                        src={member.avatar} 
                                        alt={member.name} 
                                        height="460" 
                                        width="460" 
                                        loading="lazy" 
                                    />
                                </div>
                                <span className="mt-2 block text-sm font-medium">{member.name}</span>
                                <span className="text-muted-foreground block text-xs text-gray-500">{member.role}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}