import { useState, useCallback, useEffect } from 'react';

interface ComposeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  mediaId?: string;
  defaultText: string;
  onTweet: (text: string) => Promise<void>;
}

const MAX_CHARS = 280;

export const ComposeDialog: React.FC<ComposeDialogProps> = ({ 
  isOpen, 
  onClose, 
  mediaId, 
  defaultText,
  onTweet 
}) => {
  const [text, setText] = useState(defaultText);
  const [isPosting, setIsPosting] = useState(false);
  const charsLeft = MAX_CHARS - text.length;

  // Reset text when dialog opens with new default text
  useEffect(() => {
    if (isOpen) {
      setText(defaultText);
    }
  }, [isOpen, defaultText]);

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const handlePost = useCallback(async () => {
    if (text.length > MAX_CHARS) return;
    
    try {
      setIsPosting(true);
      await onTweet(text);
      onClose();
    } catch (error) {
      console.error('Failed to post tweet:', error);
      alert('Failed to post tweet. Please try again.');
    } finally {
      setIsPosting(false);
    }
  }, [text, onTweet, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div 
          className="bg-white rounded-xl w-[600px] max-w-full relative"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b">
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              ✕
            </button>
            <span className="font-bold">
              {mediaId ? 'Post with media' : 'Compose post'}
            </span>
            <div className="w-8" />
          </div>

          {/* Content */}
          <div className="p-4">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What's happening?"
              className="w-full min-h-[150px] resize-none border-0 focus:outline-none text-xl"
              disabled={isPosting}
            />
            
            {mediaId && (
              <div className="mt-4 border rounded-xl p-2 bg-gray-50">
                <div className="text-sm text-gray-500">Media attached</div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t">
            <div className="flex justify-between items-center">
              <div className={`text-sm ${charsLeft < 0 ? 'text-red-500' : 'text-gray-500'}`}>
                {charsLeft} characters remaining
              </div>
              <button
                onClick={handlePost}
                disabled={charsLeft < 0 || isPosting}
                className={`
                  bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full
                  flex items-center justify-center transition-colors
                  disabled:opacity-50 disabled:cursor-not-allowed
                  font-semibold
                `}
              >
                {isPosting && (
                  <svg 
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24"
                  >
                    <circle 
                      className="opacity-25" 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      stroke="currentColor" 
                      strokeWidth="4"
                    />
                    <path 
                      className="opacity-75" 
                      fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                )}
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};