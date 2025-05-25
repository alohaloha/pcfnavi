import {Section} from "@/components/Section";
import {Grid} from "@/components/Grid";
import {TooltipProvider, Tooltip, TooltipTrigger, TooltipContent, Portal} from '@radix-ui/react-tooltip';
import Script from 'next/script';

export const metadata = {
    title: "ギャラリー | 電くるなび",
    description: "パワーチェアフットボールの写真や動画ギャラリー",
};

const galleryItems = [
    {
        type: "Vimeo",
        source: "Vimeo",
        title: "Powerchair Football INTRO",
        comment: '第1回Powerchair Football World Cup。発案・企画・運営を日本が行なった。\n2013年公開。',
        embedUrl: "https://player.vimeo.com/video/65429673",
        pageUrl: "https://vimeo.com/65429673"
    },
    {
        type: "YouTube",
        source: "atsushi matsumoto YouTubeチャンネル",
        title: "PowerChair Football (Japan)電動車椅子サッカー・指先のファンタジスタ達",
        comment: '第19回日本選手権大会の動画を中心に動画クリエイター松本敦氏が制作。\n2015年公開。',
        embedUrl: "https://www.youtube.com/embed/c1Hdr9RqHz0",
        pageUrl: "https://www.youtube.com/watch?v=c1Hdr9RqHz0"
    },
    {
        type: "YouTube",
        source: "JPFA公式YouTube",
        title: "サッカーは、僕らの夢だ。",
        comment: 'JPFA（日本電動車椅子サッカー協会）公式PVの第一弾。\n2015年の大会動画を中心に2016年公開。',
        embedUrl: "https://www.youtube.com/embed/pkd2Pj4PzEU",
        pageUrl: "https://www.youtube.com/watch?v=pkd2Pj4PzEU"
    },
    {
        type: "Vimeo",
        source: "Palmer Douglas Durr vimeoチャンネル",
        title: "FIPFA WORLD CUP",
        comment: "2017年FIPFA World Cupの公式PV。2017年公開。\n日本がドーン！がかっこいい。大会会場で編集して公開したという裏話も掲載元に記載されている。",
        embedUrl: "https://player.vimeo.com/video/224964220",
        pageUrl: "https://vimeo.com/224964220"
    },
    {
        type: "X",
        source: "FIFA公式",
        title: "Powerchair football is a sport for everyone!",
        comment: "FIFAが公開した動画。FIPFAではなくFIFAが公開というところに大きな意味があると言える。\n2020年公開",
        embedUrl: "https://x.com/fifacom/status/1278286949992861696",
        pageUrl: "https://twitter.com/fifacom/status/1278286949992861696"
    },
    {
        type: "YouTube",
        source: "YouTube",
        title: "障がいがあってもサッカーがしたい【電動車椅子サッカー紹介動画】 ",
        comment: '日本電動車椅子サッカー協会公式PV第２弾。2021年公開。\n制作：中村和彦監督',
        embedUrl: "https://www.youtube.com/embed/WsXn1UErXPg",
        pageUrl: "https://www.youtube.com/watch?v=WsXn1UErXPg"
    },
    {
        type: "X",
        source: "FCクラッシャーズ（長野県）公式X",
        title: "日常風景",
        comment: null,
        embedUrl: "https://x.com/i/status/1688006419378053121",
        pageUrl: "https://twitter.com/i/status/1688006419378053121"
    },
    {
        type: "Facebook",
        source: "SAGA2024オープン競技電動車椅子サッカー　大会実行委員会ページ",
        title: "Gottoi Yoka祭！蹴覧音さが大会（閉会式）",
        comment: null,
        embedUrl: "https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fpermalink.php%3Fstory_fbid%3Dpfbid0g5SkTJuu4zM77w8zgUsRvesfUzLPZ973KJSMEB7fMHpxsk22XCDN2proqBkZfbyRl%26id%3D61561233526857&w", // ←埋め込み専用URL
        pageUrl: "https://www.facebook.com/permalink.php?story_fbid=pfbid0g5SkTJuu4zM77w8zgUsRvesfUzLPZ973KJSMEB7fMHpxsk22XCDN2proqBkZfbyRl&id=61561233526857"
    },
    {
        type: "YouTube",
        source: "日本電動車椅子サッカー協会公式YouTube",
        title: "GOTTOI YOKA祭！蹴覧音さが大会",
        comment: 'SAGA2024オープン競技電動車椅子サッカー競技「蹴覧音さが大会」実行委員会企画の記念動画。\n2024年公開。制作：株式会社鼓地蔵',
        embedUrl: "https://www.youtube.com/embed/imnu6Fm2vYs",
        pageUrl: "https://www.youtube.com/watch?v=imnu6Fm2vYs"
    },
    {
        type: "YouTube",
        source: "佐賀県嬉野市公式YouTube",
        title: "SAGA2024全障スポ　電動車椅子サッカー",
        comment: 'SAGA2024オープン競技電動車椅子サッカー　大会エンドロール。大会の閉会式で暗転した中で上映された。2024年公開。',
        embedUrl: "https://www.youtube.com/embed/NAYtqzTyKqg",
        pageUrl: "https://www.youtube.com/watch?v=NAYtqzTyKqg"
    },
];

const GalleryPage = () => {
    return (
        <TooltipProvider>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {galleryItems.map((item, index) => (
                    <div key={index}
                         className="p-4 border bg-white rounded-lg shadow-md overflow-visible min-h-[500px] flex flex-col justify-between">
                        <h3 className="text-lg font-bold mt-2 overflow-hidden text-ellipsis whitespace-nowrap">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <a href={item.pageUrl} target="_blank" rel="noopener noreferrer"
                                       className="relative group">
                                        {item.title}
                                    </a>
                                </TooltipTrigger>
                                <Portal>
                                    <TooltipContent side="bottom" align="center"
                                                    className="bg-white text-gray-800 text-xs rounded shadow-lg py-1 px-2">
                                        {`${item.title} - ${item.embedUrl}`}
                                    </TooltipContent>
                                </Portal>
                            </Tooltip>
                        </h3>
                        <p className="text-sm text-gray-500 mb-1">{item.source}</p>
                        {item.type === "YouTube" && (
                            <iframe
                                width="100%"
                                height="315"
                                src={item.embedUrl}
                                title={item.title}
                                style={{border: 0}}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer"
                            ></iframe>
                        )}
                        {item.type === "Vimeo" && (
                            <iframe
                                src={item.embedUrl}
                                width="100%"
                                height="315"
                                style={{border: 0}}
                                allow="autoplay; fullscreen; picture-in-picture"
                                allowFullScreen
                                title={item.title}
                            ></iframe>
                        )}
                        {item.type === "X" && (
                            <div className="max-h-[315px] overflow-auto">
                                <blockquote className="twitter-tweet">
                                    <a href={item.pageUrl}></a>
                                </blockquote>
                            </div>
                        )}
                        {item.type === "Facebook" && (
                            <div className="max-h-[560px] overflow-hidden">
                                <iframe
                                    src={item.embedUrl}
                                    width="100%"
                                    height="315px"
                                    style={{border: "none", overflow: "hidden"}}
                                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        )}
                        <p className="text-sm text-gray-500 mt-2 whitespace-pre-line">
                            {item.comment || ""}
                        </p>
                    </div>
                ))}
            </div>
            <Script src="https://platform.twitter.com/widgets.js" strategy="lazyOnload"/>
        </TooltipProvider>
    );
};

export default GalleryPage; 