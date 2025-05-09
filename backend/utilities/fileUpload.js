const fs = require('fs');
const path = require('path');

const fileUpload = (file) => {
    return new Promise(async (resolve, reject) => {
        try {
            const folderPath = await path.join(__dirname, '../media');
            const uniqRandomNumber = await Math.floor(Math.random() * 10000000000);
            const currentDate = await Date.now()
            const currentFileName = await file?.name?.replaceAll(' ', '-').replaceAll('?', '-').replaceAll('&', '-')
            const newFileName = await `${uniqRandomNumber}-${currentDate}-${currentFileName}`;
            const filePath = await path.join(folderPath, newFileName);
            await file?.mv(filePath);
            resolve(newFileName);
        } catch (error) {
            reject(error);
        }
    });
}

module.exports = fileUpload;