function ConvertToSubcurrency(amount: number , factor = 100){
    return Math.round(amount * factor);
}
export default ConvertToSubcurrency;