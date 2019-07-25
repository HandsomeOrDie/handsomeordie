const path = require("path");
const { generateTheme, getLessVars } = require("antd-theme-generator");
const inputFile =require("./fileConfig").input;  
const options = {
    stylesDir: path.join(__dirname, `./${inputFile}/common/styles`),
    antDir: path.join(__dirname, "./node_modules/antd"),
    varFile: path.join(__dirname, `./${inputFile}/common/styles/vars.less`),
    mainLessFile: path.join(__dirname, `./${inputFile}/common/styles/main.less`),
    themeVariables: [
        "@primary-color",
        "@primary-1",
        "@secondary-color",
        "@text-color",
        "@text-color-secondary",
        "@heading-color",
        "@layout-body-background",
        "@btn-primary-bg",
        "@layout-header-background",
        "@layout-sider-background",
        "@layout-trigger-background",
        "@tabs-active-color",
        "@disabled-color",
        "@table-row-hover-bg",
        "@table-header-bg",
        "@table-header-color",
        "@table-expanded-row-bg",
        "@card-head-background",
        "@border-radius-base",
        "@border-color-split",
        "@time-picker-selected-bg",
        "@background-color-light",
        "@extra-bg",
        "@extra-bg-opacity",
        "@modal-radio-dark",
        "@modal-inputnumber-dark",
        "@scrollbar-thumb",
        "@scrollbar-track",
        "@tabs-card-height"
        // "@checkbox-check-color ",
        // "@background-color-dark1",
        // "@background-color-dark2",
        // "@input-bg",
        // "@btn-default-bg",
    ],
    indexFileName: "index.html",
    outputFilePath: path.join(__dirname, "./public/color.less"),
};
  
generateTheme(options).then(less => {
    console.log("Theme generated successfully");
})
    .catch(error => {
        console.log("Error", error);
    });