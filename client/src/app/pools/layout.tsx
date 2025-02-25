export default function PoolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="w-full relative z-50 flex flex-col items-center justify-center ">
      {children}
    </main>
  );
}
