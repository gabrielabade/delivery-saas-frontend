import React from 'react';
import AdminHeader from './AdminHeader';

interface AdminPageWrapperProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
}

const AdminPageWrapper: React.FC<AdminPageWrapperProps> = ({
  children,
  title,
  subtitle,
  action,
  fullWidth = false,
  loading = false
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />

      <main className={`mx-auto ${fullWidth ? 'px-0' : 'px-2 sm:px-4 lg:px-6 max-w-7xl'} py-4 sm:py-6`}>
        {(title || action) && (
          <div className="mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="min-w-0">
                {title && (
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className="text-sm sm:text-base text-gray-600 mt-1 truncate">
                    {subtitle}
                  </p>
                )}
              </div>
              {action && <div className="flex-shrink-0">{action}</div>}
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando...</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg sm:rounded-xl border shadow-sm overflow-hidden">
            {children}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPageWrapper;