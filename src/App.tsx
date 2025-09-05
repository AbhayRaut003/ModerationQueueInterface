import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import StatusTabs from './components/StatusTabs';
import BatchActions from './components/BatchActions';
import PostList from './components/PostList';
import PostModal from './components/PostModal';
import ToastNotifications from './components/ToastNotifications';
import KeyboardShortcutsHelper from './components/KeyboardShortcutsHelper';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { Shield } from 'lucide-react';

const AppContent: React.FC = () => {
  useKeyboardShortcuts();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold text-gray-900">
                    Content Moderation
                  </h1>
                  <p className="text-sm text-gray-600">
                    Review and moderate user-submitted content
                  </p>
                </div>
                <div className="sm:hidden">
                  <h1 className="text-lg font-bold text-gray-900">
                    Moderation
                  </h1>
                </div>
              </div>
            </div>
            
            <div className="hidden md:block text-sm text-gray-500">
              Press <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">?</kbd> for shortcuts
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <StatusTabs />
          <BatchActions />
          
          <div className="p-3 sm:p-6">
            <PostList />
          </div>
        </div>
      </main>

      <PostModal />
      <ToastNotifications />
      <KeyboardShortcutsHelper />
    </div>
  );
};

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;