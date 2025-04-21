import React from 'react';

const ConfirmDialog = ({
                           isOpen,
                           title,
                           message,
                           confirmText = 'Confirm',
                           cancelText = 'Cancel',
                           onConfirm,
                           onCancel
                       }) => {
    if (!isOpen) return null;

    return (
        // Modal backdrop
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            {/* Modal content */}
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden">
                {/* Header */}
                <div className="bg-gray-50 px-6 py-4 border-b">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {title}
                    </h2>
                </div>

                {/* Body */}
                <div className="p-6">
                    <p className="text-gray-600">
                        {message}
                    </p>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
