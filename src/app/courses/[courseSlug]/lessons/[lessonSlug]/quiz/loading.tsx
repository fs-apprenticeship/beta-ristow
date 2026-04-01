export default function Loading() {
  return (
    <main className="container">
      <hgroup>
        <h1>Loading Quiz...</h1>
        <p>Generating questions now.</p>
      </hgroup>

      <p aria-busy="true" className="loader">
        Preparing quiz content...
      </p>
    </main>
  );
}
