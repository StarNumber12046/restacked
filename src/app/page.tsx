import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex h-[calc(100vh-4rem)] w-screen flex-col items-center justify-center bg-black text-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold">Re<span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-sky-400 to-violet-500">Stacked</span></h1>
        <h2 className="text-xl ">The platform for sharing tech stacks</h2>
        <button className="mt-2 rounded transition-all duration-300 bg-anim p-2"><Link href="/new">Get Started</Link></button>
        
      </div>
    </main>
  );
}
