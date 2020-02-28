export const priceCents = (price) => {
    const limit = 2;
    const index = price.toString().split("").reverse().indexOf(".");
    const result = limit - index;

    if(result !== 1) {
        return price.toString();
    }

    return price + "0";
};