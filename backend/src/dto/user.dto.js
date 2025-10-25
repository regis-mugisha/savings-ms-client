export const toUserDto = (user) => {
    return {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        createdAt: user.createdAt
    };
};
