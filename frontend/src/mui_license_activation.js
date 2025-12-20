// Импорт активатора лицензии
import { LicenseInfo } from '@mui/x-license-pro';

import { LICENSE_KEY } from './mui_license_key';

export const activateMuiX = () => {
    if (!LICENSE_KEY) {
        throw new Error('Лицензия MUI X не была обнаружена!');
    }

    LicenseInfo.setLicenseKey(LICENSE_KEY);
};

