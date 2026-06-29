export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">

      <div className="animate-pulse space-y-8">

        <div className="h-40 rounded-[32px] bg-white" />

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

          {[1,2,3,4].map((i)=>(
            <div
              key={i}
              className="h-44 rounded-[32px] bg-white"
            />
          ))}

        </div>

        <div className="h-[500px] rounded-[32px] bg-white"/>

      </div>

    </div>
  );
}