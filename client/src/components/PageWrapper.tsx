export const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen absolute inset-0 flex flex-col items-center">
      <div className="h-16 w-full" />
      <div className="w-full h-full">
        <div className=" mx-auto relative top-1/4 max-w-7xl">{children}</div>
      </div>
    </div>
  );
};
