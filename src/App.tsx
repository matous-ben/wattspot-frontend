function App() {
  return (
    <main className="min-h-dvh bg-app px-4 py-10 text-fg">
      <section className="mx-auto max-w-md rounded-2xl border border-line bg-surface p-6 shadow-lg">
        <p className="text-sm font-medium text-fg-muted">WattSpot</p>
        <h1 className="mt-2 text-3xl font-semibold">Základ aplikace je připraven</h1>
        <p className="mt-4 text-fg-muted">
          Tailwind CSS v4 a písmo Inter jsou připojené přes design tokeny.
        </p>
        <button
          type="button"
          className="mt-6 min-h-11 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-on-accent transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
        >
          Ověřit základní styl
        </button>
      </section>
    </main>
  )
}

export default App
