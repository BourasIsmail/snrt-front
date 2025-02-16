export function Footer() {
  return (
    <footer className="relative">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-400/10 to-transparent" />
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-400">&copy; 2025 AimNovo</span>
            <span className="h-4 w-px bg-gray-800" />
            <span className="text-sm text-gray-400">All rights reserved</span>
          </div>
          <div className="flex space-x-6">
            <a href="mailto:contact@aimnovo.com" className="text-sm text-gray-400 hover:text-gray-300">
              contact@aimnovo.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

