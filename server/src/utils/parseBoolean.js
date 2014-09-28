
module.exports = function(value, def) {
    if(value === undefined || value == '') {
        return def;
    }

    if(value == 1 || value == 'yes' || value == 'true') {
        return true;
    }
    else if(value == 0 || value == 'no' || value == 'false') {
        return false;
    }

    return def;
};
