export default function OrderTrackingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        <nav className="flex items-center gap-6 text-base">
          <div className="font-semibold text-blue-800">Lubricants International</div>
          <a className="text-gray-600 hover:text-gray-900" href="#">
            Home
          </a>
          <a className="text-gray-600 hover:text-gray-900" href="#">
            Orders
          </a>
          <a className="text-gray-600 hover:text-gray-900" href="#">
            Shipments
          </a>
          <a className="text-gray-600 hover:text-gray-900" href="#">
            Analytics
          </a>
        </nav>
        <div className="flex items-center gap-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200">
            <svg
              className="h-5 w-5 text-gray-600"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        </div>
      </div>
    </header>
  );
}
