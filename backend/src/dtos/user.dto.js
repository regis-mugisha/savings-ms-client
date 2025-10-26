export const toUserDto = (user) => {
    return {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        deviceId: user.deviceId,
        deviceVerified: user.deviceVerified,
        balance: user.balance,
        createdAt: user.createdAt,
    };
};
