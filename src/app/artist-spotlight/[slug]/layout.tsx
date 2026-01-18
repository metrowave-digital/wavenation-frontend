export default function ArtistSpotlightLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main
      style={{
        background: '#0b0b0d',
        color: '#f5f5f7',
        minHeight: '100vh',
      }}
    >
      {children}
    </main>
  )
}
