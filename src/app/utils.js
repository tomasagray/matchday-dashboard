import dayjs from "dayjs";

const dateFormatter = 'MM/DD/YYYY'
const jsonPrefix = 'data:text/json;charset=utf-8,'

export const formatDate = (date) => dayjs(date).format(dateFormatter)

export const getClassName = (clazz) => {
    if (!clazz) return null
    if (clazz.includes('.')) {
        let packages = clazz.split('.')
        let className = packages[packages.length -1]
        return className.trim()
    } else {
        return clazz.trim()
    }
}

export const getDownloadableJson = (data) => jsonPrefix + encodeURIComponent(JSON.stringify(data))

export const getToastMessage = (msg) => msg.data ?? msg.error
