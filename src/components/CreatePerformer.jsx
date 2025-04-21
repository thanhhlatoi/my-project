import React, { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { BASE_URL } from "../api/config.js";

const CreatePerformer = ({
                          isOpen,
                          closeModal,
                          newAuthor = {}, // Đặt giá trị mặc định là object rỗng
                          setNewAuthor,
                          handleSubmit,
                          isEditing
                      }) => {
    // Đảm bảo newAuthor luôn là một object, ngay cả khi nhận undefined
    const author = newAuthor || {};

    // State để xem trước ảnh
    const [avatarPreview, setAvatarPreview] = useState(null);

    // Reset preview khi author thay đổi hoặc modal đóng/mở
    useEffect(() => {
        if (isOpen && author.avatar) {
            if (author.avatar.startsWith('http')) {
                setAvatarPreview(author.avatar);
            } else {
                setAvatarPreview(`${BASE_URL}/api/videos/view?bucketName=thanh&path=${author.avatar}`);
            }
        } else {
            setAvatarPreview(null);
        }
    }, [isOpen, author.avatar]);

    // Hàm xử lý khi chọn file
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Tạo object URL để xem trước
            const objectUrl = URL.createObjectURL(file);
            setAvatarPreview(objectUrl);

            // Ở đây bạn có thể thêm code để upload file lên server
            // Ví dụ:
            // const formData = new FormData();
            // formData.append('file', file);
            // axios.post('/api/upload', formData).then(res => {
            //     setNewAuthor({ ...author, avatar: res.data.path });
            // });

            // Tạm thời chỉ cập nhật filename để demo
            setNewAuthor({ ...author, avatar: `avatars/${file.name}` });
        }
    };

    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={closeModal}>
                <div className="flex items-center justify-center min-h-screen px-4">
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

                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 z-50 relative">
                            <Dialog.Title className="text-xl font-bold text-blue-700 mb-4">
                                {isEditing ? 'Edit Author' : 'Add New Author'}
                            </Dialog.Title>

                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                    <input
                                        type="text"
                                        className="mt-1 p-2 border rounded w-full"
                                        value={author.fullName || ''}
                                        onChange={(e) => setNewAuthor({ ...author, fullName: e.target.value })}
                                    />
                                </div>

                                {/* Avatar selection with preview */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Avatar</label>
                                    <div className="flex items-start space-x-4">
                                        {/* Avatar preview */}
                                        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border flex items-center justify-center">
                                            {avatarPreview ? (
                                                <img
                                                    src={avatarPreview}
                                                    alt="Avatar Preview"
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => e.target.src = '/api/placeholder/120/120'}
                                                />
                                            ) : (
                                                <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </div>

                                        {/* Upload controls */}
                                        <div className="flex-1">
                                            <div className="flex flex-col space-y-2">
                                                <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700">
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
                                                    </svg>
                                                    Choose File
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={handleFileChange}
                                                    />
                                                </label>

                                                {avatarPreview && (
                                                    <button
                                                        type="button"
                                                        className="text-red-600 text-sm hover:underline"
                                                        onClick={() => {
                                                            setAvatarPreview(null);
                                                            setNewAuthor({ ...author, avatar: '' });
                                                        }}
                                                    >
                                                        Remove Image
                                                    </button>
                                                )}
                                            </div>

                                            <p className="mt-2 text-xs text-gray-500">
                                                Or enter image URL:
                                            </p>
                                            <input
                                                type="text"
                                                className="mt-1 p-2 border rounded w-full text-sm"
                                                placeholder="https://example.com/image.jpg"
                                                value={author.avatar || ''}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setNewAuthor({ ...author, avatar: value });

                                                    // Update preview if URL entered
                                                    if (value && (value.startsWith('http') || value.includes('/'))) {
                                                        const previewUrl = value.startsWith('http')
                                                            ? value
                                                            : `${BASE_URL}/api/videos/view?bucketName=thanh&path=${value}`;
                                                        setAvatarPreview(previewUrl);
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Birthday</label>
                                    <input
                                        type="date"
                                        className="mt-1 p-2 border rounded w-full"
                                        value={author.birthday || ''}
                                        onChange={(e) => setNewAuthor({ ...author, birthday: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Country</label>
                                    <input
                                        type="text"
                                        className="mt-1 p-2 border rounded w-full"
                                        value={author.country || ''}
                                        onChange={(e) => setNewAuthor({ ...author, country: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Gender</label>
                                    <select
                                        className="mt-1 p-2 border rounded w-full"
                                        value={author.gender === false ? 'false' : 'true'}
                                        onChange={(e) => setNewAuthor({ ...author, gender: e.target.value === 'true' })}
                                    >
                                        <option value="true">Male</option>
                                        <option value="false">Female</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Description</label>
                                    <textarea
                                        className="mt-1 p-2 border rounded w-full"
                                        rows="3"
                                        value={author.describe || ''}
                                        onChange={(e) => setNewAuthor({ ...author, describe: e.target.value })}
                                    ></textarea>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                                >
                                    {isEditing ? 'Update' : 'Add'}
                                </button>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
};

export default CreatePerformer;
