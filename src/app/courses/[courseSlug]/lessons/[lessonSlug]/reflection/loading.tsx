export default function Loading() {
  return (
    <main className="container">
      <hgroup>
        <h1>Loading Reflection...</h1>
        <p>Generating reflection feedback now.</p>
      </hgroup>

      <p aria-busy="true" className="loader">
        Preparing reflection content...
      </p>
    </main>
  );
}
