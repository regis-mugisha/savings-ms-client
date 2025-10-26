export const toAdminDto = (admin) => {
    return {
        _id: admin._id,
        fullName: admin.fullName,
        email: admin.email,
        createdAt: admin.createdAt,
    };
};