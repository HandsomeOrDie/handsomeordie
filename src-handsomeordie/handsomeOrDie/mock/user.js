import * as Mock from "mockjs";

export const data = {
    name: "Test"
};

Mock.mock("/mock/user",{
    code: 0,
    data
});