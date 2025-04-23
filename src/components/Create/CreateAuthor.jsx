import React, { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import AuthorService from "../../api/AuthorService.js";
import { BASE_URL } from "../../api/config.js";

const CreateAuthor = ({
                          isOpen,
                          closeModal,
                          newAuthor = {},
                          setNewAuthor,
                          isEditing = false,
                          onSuccess

                      }) => {
    const author = newAuthor || {};

    // Khởi tạo state ban đầu
    const [formData, setFormData] = useState({
        fullName: '',
        birthday: '',
        gender: '',
        country: '',
        description: '',
        fileAvatar: null
    });

    const [avatarPreview, setAvatarPreview] = useState(null);

    // Cập nhật form data khi modal mở và có dữ liệu author
    useEffect(() => {
        if (isOpen) {
            // Chỉ cập nhật các trường từ author nếu chúng tồn tại
            setFormData(prev => ({
                ...prev,
                fullName: author.fullName || prev.fullName,
                birthday: author.birthday || prev.birthday,
                gender: author.gender?.toString() || prev.gender,
                country: author.country || prev.country,
                description: author.description || prev.description
                // Không reset fileAvatar
            }));

            // Xử lý avatar preview
            if (author.avatar) {
                setAvatarPreview(
                    author.avatar.startsWith('http')
                        ? author.avatar
                        : `${BASE_URL}/api/videos/view?bucketName=thanh&path=${author.avatar}`
                );
            } else {
                setAvatarPreview(null);
            }
        }
    }, [isOpen, author]);

    const handleInputChange = ({ target }) => {
        const { name, value, type, checked } = target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };


    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setAvatarPreview(objectUrl);

            // Giữ nguyên các trường khác khi chọn file
            setFormData(prev => ({
                ...prev,
                fileAvatar: file
            }));

            setNewAuthor(prev => ({
                ...prev,
                fileAvatar: `avatars/${file.name}`
            }));
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        const form = new FormData();
        form.append("fullName", formData.fullName);
        form.append("birthday", formData.birthday);
        form.append("gender", formData.gender);
        form.append("country", formData.country);
        form.append("description", formData.description);
        if (formData.fileAvatar) {
            form.append("fileAvatar", formData.fileAvatar);
        }

        try {
            const result = await AuthorService.add(form);
            console.log("Author added:", result);
            if (onSuccess) onSuccess(); // ⬅ gọi lại hàm load
            closeModal();  // đóng modal
        } catch (error) {
            console.error("Submit failed:", error);
        }
    };

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

                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                            <Dialog.Title className="text-lg font-bold text-blue-700">
                                {isEditing ? 'Edit Author' : 'Create Author'}
                            </Dialog.Title>

                            <form  onSubmit={handleSubmit} className="space-y-4 mt-4">
                                <div>
                                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
                                    <input
                                        type="text"
                                        id="fullName"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="birthday" className="block text-sm font-medium text-gray-700">Birthday</label>
                                    <input
                                        type="date"
                                        id="birthday"
                                        name="birthday"
                                        value={formData.birthday}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Gender</label>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                                    >
                                        <option value="true">Male</option>
                                        <option value="false">Female</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
                                    <input
                                        type="text"
                                        id="country"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows="3"
                                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Avatar</label>
                                    <div className="flex items-center space-x-4 mt-1">
                                        <div className="w-24 h-24 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
                                            {avatarPreview ? (
                                                <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                                            ) : (
                                                <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </div>
                                        <div>
                                            <input
                                                type="file"
                                                name="fileAvatar"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="hidden"
                                                id="fileAvatar"
                                            />
                                            <label htmlFor="fileAvatar" className="cursor-pointer px-3 py-1 border rounded-md bg-white text-sm text-gray-700 hover:bg-gray-100">
                                                Choose File
                                            </label>
                                            {formData.fileAvatar && (
                                                <p className="text-sm mt-1 text-gray-500">{formData.fileAvatar.name}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-2 pt-4">
                                    <button type="button" onClick={closeModal} className="px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-700">
                                        Cancel
                                    </button>
                                    <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
                                        {isEditing ? 'Update' : 'Create'}
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

export default CreateAuthor;
