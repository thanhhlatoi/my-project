import React, { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Palette, Tag } from 'lucide-react';

const CreateCategory = ({
    isOpen,
    closeModal,
    newCategory = null,
    setNewCategory,
    handleSubmit,
    isEditing = false
}) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        color: '#3B82F6',
        icon: '📂',
        active: true
    });

    // Cập nhật form data khi modal mở
    useEffect(() => {
        if (isOpen && newCategory) {
            setFormData({
                name: newCategory.name || '',
                description: newCategory.description || '',
                color: newCategory.color || '#3B82F6',
                icon: newCategory.icon || '📂',
                active: newCategory.active !== undefined ? newCategory.active : true
            });
        } else if (isOpen && !isEditing) {
            // Reset form for new category
            setFormData({
                name: '',
                description: '',
                color: '#3B82F6',
                icon: '📂',
                active: true
            });
        }
    }, [isOpen, newCategory, isEditing]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;
        
        setFormData(prev => ({
            ...prev,
            [name]: newValue
        }));
        
        // Update parent state
        if (setNewCategory) {
            setNewCategory(prev => ({
                ...prev,
                [name]: newValue
            }));
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name.trim()) {
            alert('Category name is required');
            return;
        }

        try {
            await handleSubmit();
        } catch (error) {
            console.error('Error submitting category:', error);
            alert('Failed to save category. Please try again.');
        }
    };

    const predefinedColors = [
        '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
        '#8B5CF6', '#06B6D4', '#84CC16', '#F97316',
        '#EC4899', '#14B8A6', '#F59E0B', '#6366F1'
    ];

    const predefinedIcons = [
        '📂', '🎬', '📺', '🎭', '🎪', '🎨',
        '🎵', '🎮', '📚', '⚽', '🏀', '🎯',
        '🔥', '⭐', '💎', '🎈', '🌟', '🎊'
    ];

    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={closeModal}>
                <div className="min-h-screen px-4 text-center">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-30" />
                    </Transition.Child>

                    <span className="inline-block h-screen align-middle" aria-hidden="true">
                        &#8203;
                    </span>

                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel className="inline-block w-full max-w-lg p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                            <div className="flex items-center justify-between mb-4">
                                <Dialog.Title className="text-lg font-bold text-amber-700 flex items-center gap-2">
                                    <Tag size={20} />
                                    {isEditing ? 'Edit Category' : 'Create Category'}
                                </Dialog.Title>
                                <button
                                    onClick={closeModal}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={onSubmit} className="space-y-4">
                                {/* Category Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Category Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                        placeholder="Enter category name"
                                        required
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows="3"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                        placeholder="Enter category description (optional)"
                                    />
                                </div>

                                {/* Icon Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Icon
                                    </label>
                                    <div className="grid grid-cols-6 gap-2 mb-2">
                                        {predefinedIcons.map((icon) => (
                                            <button
                                                key={icon}
                                                type="button"
                                                onClick={() => handleInputChange({ target: { name: 'icon', value: icon } })}
                                                className={`p-2 text-lg border rounded-lg hover:bg-gray-50 transition-colors ${
                                                    formData.icon === icon 
                                                        ? 'border-amber-500 bg-amber-50' 
                                                        : 'border-gray-200'
                                                }`}
                                            >
                                                {icon}
                                            </button>
                                        ))}
                                    </div>
                                    <input
                                        type="text"
                                        name="icon"
                                        value={formData.icon}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-1 border border-gray-300 rounded text-center"
                                        placeholder="Or enter custom icon"
                                    />
                                </div>

                                {/* Color Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                        <Palette size={16} />
                                        Color
                                    </label>
                                    <div className="grid grid-cols-6 gap-2 mb-2">
                                        {predefinedColors.map((color) => (
                                            <button
                                                key={color}
                                                type="button"
                                                onClick={() => handleInputChange({ target: { name: 'color', value: color } })}
                                                className={`w-8 h-8 rounded-lg border-2 transition-all ${
                                                    formData.color === color 
                                                        ? 'border-gray-800 scale-110' 
                                                        : 'border-gray-300 hover:border-gray-400'
                                                }`}
                                                style={{ backgroundColor: color }}
                                                title={color}
                                            />
                                        ))}
                                    </div>
                                    <input
                                        type="color"
                                        name="color"
                                        value={formData.color}
                                        onChange={handleInputChange}
                                        className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                                    />
                                </div>

                                {/* Preview */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Preview
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <div 
                                            className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl font-bold"
                                            style={{ backgroundColor: formData.color }}
                                        >
                                            {formData.icon}
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900">
                                                {formData.name || 'Category Name'}
                                            </div>
                                            {formData.description && (
                                                <div className="text-sm text-gray-500 line-clamp-1">
                                                    {formData.description}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Status */}
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="active"
                                        id="active"
                                        checked={formData.active}
                                        onChange={handleInputChange}
                                        className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                                    />
                                    <label htmlFor="active" className="ml-2 text-sm text-gray-700">
                                        Active category
                                    </label>
                                </div>

                                {/* Form Actions */}
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={!formData.name.trim()}
                                    >
                                        {isEditing ? 'Update Category' : 'Create Category'}
                                    </button>
                                </div>
                            </form>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
};

export default CreateCategory;
