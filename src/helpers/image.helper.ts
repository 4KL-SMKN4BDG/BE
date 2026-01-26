const imageFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];

const validateImageFileType = (file: any) => {
    if (!file) return false;
    return imageFileTypes.includes(file.mimetype);
};

export { validateImageFileType };