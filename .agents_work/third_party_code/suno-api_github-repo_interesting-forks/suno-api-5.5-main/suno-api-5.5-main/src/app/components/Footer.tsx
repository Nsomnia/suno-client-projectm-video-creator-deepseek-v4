import Link from "next/link";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className=" flex w-full justify-center py-4 items-center
        bg-indigo-900 text-white/60 backdrop-blur-2xl font-mono text-sm px-4 lg:px-0
      ">
            <p className="px-6 py-3 rounded-full flex justify-center items-center gap-2
             hover:text-white duration-200
                ">

            </p>
            <p className="px-6 py-3 rounded-full flex justify-center items-center gap-2
             hover:text-white duration-200
                ">
                <span>© 2026</span>
                <Link href="https://github.com/raptor7242N/suno-api-5.5">
                    raptor7242N/suno-api-5.5
                </Link>
                <span>·</span>
                <a href="https://github.com/2569658930/tan" target="_blank" rel="noreferrer">
                    Suno Funnel by @2569658930
                </a>
            </p>
        </footer>
    );
}
