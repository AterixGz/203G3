const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, '../data/database.json');

// อ่านข้อมูลจากไฟล์ JSON
const readDataFromFile = () => {
    if (fs.existsSync(dataFilePath)) {
        const rawData = fs.readFileSync(dataFilePath);
        return JSON.parse(rawData);
    }
    return {};
};

// เขียนข้อมูลลงในไฟล์ JSON
const writeDataToFile = (data) => {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

module.exports = { readDataFromFile, writeDataToFile };
