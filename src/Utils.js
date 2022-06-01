import moment from "moment";

const dateFormatter = 'MM/DD/YYYY';

export function formatDate(date) {
    return moment(date).format(dateFormatter);
}

export const getClassName = (clazz) => {
    if (clazz.includes('.')) {
        let packages = clazz.split('.')
        let className = packages[packages.length -1]
        return className.trim()
    } else {
        return clazz.trim()
    }
}
