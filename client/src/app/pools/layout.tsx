

export default function PoolsLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <html lang="en">
        <body>
          <main 
          className="w-full relative z-50 flex flex-col items-center justify-center "
          >{children}</main>
        </body>
      </html>
    )
  }
  