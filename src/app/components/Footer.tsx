export default function Footer() {
  return (
    <footer className="mt-auto w-full py-6 px-4 bg-slate-900/90 border-t border-slate-700">
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-sm text-slate-400">
          © 2026 Card Vault. Built by{' '}
          <a 
            href="https://shenabeth.github.io/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-purple-400 hover:text-purple-300 font-semibold transition-colors underline"
          >
            Shenabeth Jenkins
          </a>
          {' '}with React and designed to organize TCG collections.
        </p>
      </div>
    </footer>
  );
}
