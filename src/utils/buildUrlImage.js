import {BASE_IMAGE_URL} from "../constants/base-url.js";

export const buildUrlImage = (patch, size = 'w500') => {
    return `${BASE_IMAGE_URL}/${size}${patch}`;
}