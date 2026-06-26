export default function CallbackPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 text-white">
      <div className="text-center max-w-md p-8">
        <div className="text-4xl mb-4">✓</div>
        <h1 className="text-2xl font-bold mb-2">You&apos;re signed in!</h1>
        <p className="text-gray-400 mb-6">
          You can now close this tab and return to the Fillyfy extension.
          Your session will sync automatically.
        </p>
        <p className="text-sm text-gray-500">
          This tab can be safely closed.
        </p>
      </div>
    </div>
  );
}
