import React, { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import AuthorService from "../../api/AuthorService.js";
import { BASE_URL } from "../../api/config.js";

const CreateAuthor = ({
                          isOpen,
                          closeModal,
                          newAuthor = null,
                          isEditing = false,
                          onSuccess
                      }) => {
    // Khởi tạo state ban đầu
    const [formData, setFormData] = useState({
        id: '' ,
        fullName: '',
        birthday: '',
        gender: 'true', // Đặt giá trị mặc định
        country: '',
        description: '',
        fileAvatar: null
    });

    const [avatarPreview, setAvatarPreview] = useState(null);

    // Reset form khi modal đóng
    useEffect(() => {
        if (!isOpen) {
            setFormData({
                fullName: '',
                birthday: '',
                gender: 'true',
                country: '',
                description: '',
                fileAvatar: null
            });
            setAvatarPreview(null);
        }
    }, [isOpen]);

    // Cập nhật form data khi modal mở và có dữ liệu newAuthor
    useEffect(() => {
        if (isOpen && newAuthor) {
            // Format ngày sinh nếu có
            const formattedBirthday = newAuthor.birthday
                ? new Date(newAuthor.birthday).toISOString().split('T')[0]
                : '';

            // Chỉ cập nhật các trường từ newAuthor nếu chúng tồn tại
            setFormData({
                fullName: newAuthor.fullName || '',
                birthday: formattedBirthday,
                gender: newAuthor.gender?.toString() || 'true',
                country: newAuthor.country || '',
                description: newAuthor.description || '',
                fileAvatar: null // Luôn reset fileAvatar
            });

            // Xử lý avatar preview
            if (newAuthor.avatar) {
                setAvatarPreview(
                    newAuthor.avatar.startsWith('http')
                        ? newAuthor.avatar
                        : `${BASE_URL}/api/videos/view?bucketName=thanh&path=${newAuthor.avatar}`
                );
            } else {
                setAvatarPreview(null);
            }
        }
    }, [isOpen, newAuthor]);

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
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const form = new FormData();
        form.append("fullName", formData.fullName);

        // Chỉ thêm birthday nếu có giá trị
        if (formData.birthday) {
            form.append("birthday", formData.birthday);
        }

        form.append("gender", formData.gender);

        // Chỉ thêm các trường không bắt buộc nếu có giá trị
        if (formData.country) {
            form.append("country", formData.country);
        }

        if (formData.description) {
            form.append("description", formData.description);
        }

        if (formData.fileAvatar) {
            form.append("fileAvatar", formData.fileAvatar);
        }
        // Kiểm tra token từ localStorage trực tiếp để debug
        const token = localStorage.getItem('authToken');
        console.log('Direct token from localStorage:', token);

        // Và kiểm tra từ service
        const serviceToken = AuthorService.auth.getToken();
        console.log('Token from service:', serviceToken);

        if (!token) {
            alert('Vui lòng đăng nhập lại');
            return;
        }


        try {
            if (isEditing && newAuthor?.id) {
                // Nếu đang chỉnh sửa, gọi API update
                await AuthorService.update(newAuthor.id, form);
                console.log("Author updated:", newAuthor.id);
            } else {
                // Nếu thêm mới, gọi API add
                await AuthorService.add(form);
                console.log("Author added successfully");
            }

            // Gọi callback onSuccess nếu có
            if (onSuccess) onSuccess();

            // Đóng modal
            closeModal();
        } catch (error) {
            console.error("Submit failed:", error);
            alert(error.response?.data?.message || "Không thể lưu tác giả");
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

                    {/* This element is to trick the browser into centering the modal contents. */}
                    <span
                        className="inline-block h-screen align-middle"
                        aria-hidden="true"
                    >
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
                        <Dialog.Panel className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                            <Dialog.Title className="text-lg font-bold text-blue-700">
                                {isEditing ? 'Edit Author' : 'Create Author'}
                            </Dialog.Title>

                            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
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
                                        <option value="true">Nam</option>
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
