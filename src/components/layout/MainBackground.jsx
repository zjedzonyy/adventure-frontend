export default function MainBackground({ children }) {
  return (
    // Adventure themed background patterns

    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated floating elements */}
      <div className="absolute top-10 left-10 opacity-20">
        <Mountain className="w-16 h-16 text-white animate-pulse" />
      </div>
      <div className="absolute top-32 right-20 opacity-15">
        <Compass
          className="w-20 h-20 text-white animate-spin"
          style={{ animationDuration: "20s" }}
        />
      </div>
      <div className="absolute bottom-20 left-16 opacity-20">
        <Map className="w-12 h-12 text-white animate-bounce" style={{ animationDelay: "1s" }} />
      </div>
      <div className="absolute bottom-40 right-32 opacity-15">
        <Star className="w-8 h-8 text-white animate-ping" style={{ animationDelay: "2s" }} />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fill-opacity='0.1'%3E%3Cpath d='m0 40l40-40h-40v40zm20-40v40'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>
    </div>
  );
}
