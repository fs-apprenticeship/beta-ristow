export default function IntroLoading() {
  return (
    <main
      className="container"
      style={{
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div className="spinner" />
        <p>Loading...</p>
      </div>

      <style>{`
        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #ccc;
          border-top-color: #000;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 0 auto 1rem;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </main>
  );
}
