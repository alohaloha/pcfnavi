import Image from 'next/image';
import {Metadata} from 'next';
import {Knewave} from 'next/font/google';

const knewave = Knewave({
    weight: '400',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'PCF Navi – Coming Soon',
    description: 'Powerchair Football fan portal is getting ready.',
    robots: 'noindex, nofollow',         // ★ 検索エンジンに載せない
};

export default function Home() {
    return (
        <main className="grid min-h-screen place-items-center bg-cream text-primary">
            <div className="text-center">
                <h1 className={`text-6xl font-extrabold tracking-tight text-primary drop-shadow-sm ${knewave.className}`}>
                    PCF Navi
                </h1>
                <div className="mt-8 max-w-md">
                    <Image
                        src="/images/just_one_step_forward.jpg"
                        alt="Powerchair Football - Just one step forward, and the world begins to shift"
                        width={500}
                        height={500}
                        className="rounded-lg shadow-lg"
                    />
                </div>
                <p className={`mt-4 text-2xl ${knewave.className}`}>
                    Our new site is launching soon. Stay tuned!
                </p>
            </div>
        </main>
    );
}
