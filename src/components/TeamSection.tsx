export default function TeamSection() {
    const leadership = [
        {
            name: 'Aldy',
            role: 'Team Leader',
            credential: 'S1 Sistem Informasi UNSRAT · Cum Laude (3.93)',
            specialty: 'Cloud & Backend',
            achievement: 'Bangkit Academy · Finalis BRIN AIDeaNation',
            avatar: '/images/team/p1.png',
        },
        {
            name: 'Owen',
            role: 'Project Manager',
            credential: 'S1 Sistem Informasi UNSRAT (3.88)',
            specialty: 'Web, Mobile & AI',
            achievement: 'EcoMeter Blockchain Biogas',
            avatar: '/images/team/p5.png',
        },
        {
            name: 'Natasya',
            role: 'Finance Officer',
            avatar: '/images/team/p10.png',
        }
    ];

    const engineering = [
        {
            name: 'Kevin',
            role: 'Fullstack Developer',
            credential: 'S1 Sistem Informasi UNSRAT (3.72)',
            specialty: 'Fullstack, AI & Web3',
            achievement: 'Orderly Hire · Karwanua · ClimaSense AI',
            avatar: '/images/team/p2.png',
        },
        {
            name: 'Rizky',
            role: 'AI Engineer',
            credential: 'S1 Sistem Informasi UNSRAT (3.75)',
            specialty: 'AI Otomasi & Fullstack',
            achievement: 'AI Engineer · n8n & Hermes Agent',
            avatar: '/images/team/p7.png',
        },
        {
            name: 'Jazel',
            role: 'Quality Control',
            avatar: '/images/team/p3.png',
        }
    ];

    const creativeMarketing = [
        {
            name: 'Giordyano',
            role: 'Client Relations & Communications',
            credential: 'S1 Sistem Informasi UNSRAT · Cum Laude (3.79)',
            specialty: 'Customer Service & Komunikasi',
            achievement: 'Semifinalis GEMASTIK 2023',
            avatar: '/images/team/p8.png',
        },
        {
            name: 'Friesta',
            role: 'Team Creative',
            avatar: '/images/team/p4.png',
        },
        {
            name: 'Calvin',
            role: 'Media & Technical',
            credential: 'S1 Sistem Informasi UNSRAT',
            specialty: 'Sistem & Konten Visual',
            achievement: 'Technical & Systems Engineer Baciraro',
            avatar: '/images/team/Calvin%20Kakase.png',
        }
    ];

    const humanRelations = [
        {
            name: 'Given',
            role: 'Product & Digital Creative',
            credential: 'S1 Sistem Informasi UNSRAT · IPK 4.00',
            specialty: 'Brand Identity & Konten Visual',
            achievement: 'Finalis BRIN AIDeaNation · Brand KeyBox',
            avatar: '/images/team/p9.jpeg',
        }
    ];

    const renderMember = (member: (typeof leadership)[number], index: number) => (
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
            {'credential' in member && member.credential && (
                <span className="mt-1 block text-[11px] text-[#FF7A00] font-medium">{member.credential}</span>
            )}
            {'specialty' in member && member.specialty && (
                <span className="block text-[11px] text-gray-500">{member.specialty}</span>
            )}
            {'achievement' in member && member.achievement && (
                <span className="block text-[11px] text-gray-400">{member.achievement}</span>
            )}
        </div>
    );

    return (
        <section id="team" className="py-12 md:py-32">
            <div className="mx-auto max-w-3xl px-8 lg:px-0">
                <h2 className="mb-8 text-4xl font-bold md:mb-16 lg:text-5xl">Our team</h2>

                <div>
                    <h3 className="mb-6 text-lg font-medium">Leadership</h3>
                    <div className="grid grid-cols-2 gap-4 border-t py-6 md:grid-cols-4">
                        {leadership.map(renderMember)}
                    </div>
                </div>

                <div className="mt-6">
                    <h3 className="mb-6 text-lg font-medium">Engineering</h3>
                    <div data-rounded="full" className="grid grid-cols-2 gap-4 border-t py-6 md:grid-cols-4">
                        {engineering.map(renderMember)}
                    </div>
                </div>

                <div className="mt-6">
                    <h3 className="mb-6 text-lg font-medium">Creative & Marketing</h3>
                    <div data-rounded="full" className="grid grid-cols-2 gap-4 border-t py-6 md:grid-cols-4">
                        {creativeMarketing.map(renderMember)}
                    </div>
                </div>

                <div className="mt-6">
                    <h3 className="mb-6 text-lg font-medium">Human Relations</h3>
                    <div data-rounded="full" className="grid grid-cols-2 gap-4 border-t py-6 md:grid-cols-4">
                        {humanRelations.map(renderMember)}
                    </div>
                </div>
            </div>
        </section>
    );
}