const { exec } = require('child_process');

// Use the full path to adb
const adbPath = 'C:\\Users\\ansug\\Desktop\\platform-tools\\adb.exe';

function getSmsContent() {
    return new Promise((resolve, reject) => {
        exec(`${adbPath} -s RZ8N10VHCSJ shell content query --uri content://sms/inbox`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing command: ${error}`);
                reject(error);
            } else {
                const otpMatch = stdout.match(/body=(.*?)(?:,|$)/);
                if (otpMatch && otpMatch[1]) {
                    const otp = otpMatch[1].replace(/[^0-9]/g, ''); // Extract only digits
                    resolve(otp);
                } else {
                    reject('OTP not found');
                }
            }
        });
    });
}

(async () => {
    try {
        const otp = await getSmsContent();
        console.log(`Received OTP: ${otp}`);
    } catch (error) {
        console.error(`Failed to extract OTP: ${error}`);
    }
})();
