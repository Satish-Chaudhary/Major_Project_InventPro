import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../redux/hooks';
import { openModal } from '../redux/slices/uiSlice';

export const useKeyboardShortcuts = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleKeyDown = useCallback((event) => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const modifier = isMac ? event.metaKey : event.ctrlKey;

    if (!modifier) return;

    switch (event.key.toLowerCase()) {
      case 'k':
        event.preventDefault();
        dispatch(openModal({ modalName: 'search', mode: 'create' }));
        break;

      case 'n':
        event.preventDefault();
        navigate('/add-product');
        break;

      case 'o':
        event.preventDefault();
        navigate('/add-order');
        break;

      case 's':
        event.preventDefault();
        break;

      case 'd':
        event.preventDefault();
        navigate('/dashboard');
        break;

      case 'i':
        event.preventDefault();
        navigate('/inventory');
        break;

      case ',':
        event.preventDefault();
        navigate('/settings');
        break;

      case '?':
        event.preventDefault();
        break;

      default:
        break;
    }
  }, [navigate, dispatch]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
};

export const shortcutHelp = [
  { key: 'Ctrl/Cmd + K', action: 'Open global search' },
  { key: 'Ctrl/Cmd + N', action: 'New product' },
  { key: 'Ctrl/Cmd + O', action: 'New order' },
  { key: 'Ctrl/Cmd + D', action: 'Go to dashboard' },
  { key: 'Ctrl/Cmd + I', action: 'Go to inventory' },
  { key: 'Ctrl/Cmd + ,', action: 'Open settings' },
  { key: 'Esc', action: 'Close modal' },
];

export default useKeyboardShortcuts;