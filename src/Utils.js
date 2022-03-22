import moment from "moment";

const dateFormatter = 'MM/DD/YYYY';

export function formatDate(date) {
    return moment(date).format(dateFormatter);
}
