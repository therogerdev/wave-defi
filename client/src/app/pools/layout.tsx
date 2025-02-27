export default function PoolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="min-h-screen overflow-y-auto">{children}</main>;
}
