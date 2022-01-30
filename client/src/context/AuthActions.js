export const LoginStart = (userCredentionals) => ({
    type: "LOGIN_START"
});

export const LoginSuccess = (user) => ({
    type: "LOGIN_START",
    payload: user
});

export const LoginFailure = (error) => ({
    type: "LOGIN_START",
    type: error
});

export const VarifyUser = (user) => ({
    type: "VARIFY",
    payload: user
});
export const Follow = (userId) => ({
    type: "FOLLOW",
    payload: userId,
});

export const Unfollow = (userId) => ({
    type: "UNFOLLOW",
    payload: userId,
});